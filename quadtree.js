class Point {
    constructor(x, y, userData) {
        this.x = x; 
        this.y = y; 
        this.userData = userData;
    }
}

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rS = r*r;
    }
    
    contains(point) {
        let dY = point.y-this.y;
        let dX = point.x-this.x;
        return (dX*dX + dY*dY <= this.rS);
    }
    
    intersects(range) {
        //intersects rectangle
        return !(
            range.x - range.w > this.x + this.r ||
            range.x + range.w < this.x - this.r ||
            range.y - range.h > this.y + this.r ||
            range.y + range.h < this.y - this.r );
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    
    contains(point) {
        return (
            point.x >= this.x - this.w &&
            point.x < this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y < this.y + this.h );
    }
  
    intersects(range) {
        // two rectangle don't intersect if the top edge of one is lower than the bottom edge of the other, etc. repeat check for all edges.
        return !(
            range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h );
    }

    // intersects(boundary) {
    //     let boundaryR = boundary.x + boundary.w;
    //     let boundaryL = boundary.x - boundary.w;
    //     let boundaryT = boundary.y - boundary.h;
    //     let boundaryB = boundary.y + boundary.h;
        
    //     let rangeR = this.x + this.w;
    //     let rangeL = this.x - this.w;
    //     let rangeT = this.y - this.h;
    //     let rangeB = this.y + this.h;
        
    //     if (boundaryR >= rangeL &&
    //         boundaryL <= rangeR &&
    //         boundaryT <= rangeB &&
    //         boundaryB >= rangeT) {
    //         return true;
    //     } else {
    //         return false;
    //     }
        
    // }
}

class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }
    
    clear() {
        this.points = [];
        this.divided = false;
    }
  
    insert(point) {
        if (!this.boundary.contains(point)) {
         return false
        }
        
        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide(); 
            }
        
            if (this.northeast.insert(point)) {
                return true;
            } else if (this.northwest.insert(point)) {
                return true;
            } else if (this.southeast.insert(point)) {
                return true;
            } else if (this.southwest.insert(point)) {
                return true;
            }
        }
        
        return false;
    }
  
    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;
        
        let northeastBoundary = new Rectangle(x + w/2, y - h/2, w/2, h/2);
        this.northeast = new QuadTree(northeastBoundary, this.capacity);
        let northwestBoundary = new Rectangle(x - w/2, y - h/2, w/2, h/2);
        this.northwest = new QuadTree(northwestBoundary, this.capacity);
        let southeastBoundary = new Rectangle(x + w/2, y + h/2, w/2, h/2);
        this.southeast = new QuadTree(southeastBoundary, this.capacity);
        let southwestBoundary = new Rectangle(x - w/2, y + h/2, w/2, h/2);
        this.southwest = new QuadTree(southwestBoundary, this.capacity);
        
        this.divided = true;
        
    }
  
    query(range, found) {
        if (!found) {
            found = [];
        }
        if (!this.boundary.intersects(range)) {
            return;
        } else {
            for (let p of this.points) {
                if (range.contains(p)) {
                    found.push(p);
                }
            }
            
            if (this.divided) {
                this.northeast.query(range, found);
                this.northwest.query(range, found);
                this.southeast.query(range, found);
                this.southwest.query(range, found);
            }
        }
        return found;
    }
  
    display() {
        stroke(color(75,75,75));
        strokeWeight(1);
        noFill();
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2); 
        
        if (this.divided) {
            this.northeast.display();
            this.northwest.display();
            this.southeast.display();
            this.southwest.display();
        }
    }
}
/*
  Point

  Simple class to hold (x,y) coordinates.
*/
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

/*
  McKeeTriangle

  Class to hold information and logic related to an interactive McKee Triangle.
*/
class McKeeTriangle {

  /*
    Constructor function.

    Obtains relevant elements from the DOM.
    Also sets up event handlers for circle interactivity.
  */
  constructor() {
    this.triangle = document.querySelector('#mckee-triangle');
    this.circle = this.triangle.querySelector('#mckee-circle');
    /* Circle event handlers */
    // we bind methods and functions to invocation context so we can access
    //  class properties
    let updateCircleBind = this.updateCircle.bind(this);
    // callback for dropping a circle
    let dropCircle = function() {
      this.circle.style.cursor = '';
      this.circle.style.transform = '';
      document.removeEventListener('mousemove', updateCircleBind, true);
      document.removeEventListener('mouseup', dropCircle, true);
    }.bind(this);
    // event handlers for grabbing a circle, moving it, and dropping it
    this.circle.addEventListener('mousedown', function() {
      this.circle.style.cursor = 'grabbing';
      this.circle.style.transform = 'scale(1.2)';
      document.addEventListener('mousemove', updateCircleBind, true);
      document.addEventListener('mouseup', dropCircle, true);
    }.bind(this));
  }

  /*
    calculateTriangleArea
    p1, p2, p3: Point
    return: Number

    Calculate the area of a generic triangle given its points.
    Based on pseudocode from TutorialsPoint:
      https://www.tutorialspoint.com/Check-whether-a-given-point-lies-inside-a-Triangle
  */
  calculateTriangleArea(p1, p2, p3) {
    return Math.abs((p1.x * (p2.y - p3.y) +
                     p2.x * (p3.y - p1.y) +
                     p3.x * (p1.y - p2.y))
                    / 2.0);
  }

  /*
    verifyMousePos
    xy: Point
    return: Boolean

    Check whether a given coordinate is within the McKee Triangle.
    Based on pseudocode from TutorialsPoint:
      https://www.tutorialspoint.com/Check-whether-a-given-point-lies-inside-a-Triangle
  */
  verifyMousePos(xy) {
    // set up three points of triangle
    let pA = new Point(this.triangle.offsetLeft,
                       this.triangle.offsetTop + this.triangle.offsetHeight - window.pageYOffset);
    let pB = new Point(this.triangle.offsetLeft + this.triangle.offsetWidth / 2,
                       this.triangle.offsetTop - window.pageYOffset);
    let pC = new Point(this.triangle.offsetLeft + this.triangle.offsetWidth,
                       this.triangle.offsetTop + this.triangle.offsetHeight - window.pageYOffset);
    // check whether the sum of these areas add up to the triangle's area
    let ABC = this.calculateTriangleArea(pA, pB, pC);
    let ABP = this.calculateTriangleArea(pA, pB, xy);
    let PBC = this.calculateTriangleArea(xy, pB, pC);
    let APC = this.calculateTriangleArea(pA, xy, pC);
    let totalArea = ABP + PBC + APC;

    let leniency = 0.1;
    return ((ABC - leniency < totalArea) && (ABC + leniency > totalArea));
  }

  /*
    updateCircle
    e: Event information

    Update the circle's position.
  */
  updateCircle(e) {
    // get (x,y) of cursor
    let xy = new Point(e.clientX, e.clientY);
    // verify and update
    if (this.verifyMousePos(xy)) {
      // find new x,y of circle
      let leftPx = e.clientX - this.triangle.offsetLeft;
      let topPx = e.clientY - this.triangle.offsetTop;
      // set x,y
      this.circle.setAttribute('style', '');
      this.circle.style.left = `calc(${leftPx}px - 1rem)`;
      this.circle.style.top = `calc(${topPx + window.pageYOffset}px - 1rem)`;
      // visual styling
      this.circle.style.cursor = 'grabbing';
      this.circle.style.transform = 'scale(1.2)';
    }
  }

}

let m = new McKeeTriangle();

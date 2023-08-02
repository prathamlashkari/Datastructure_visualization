// first creating node class for the node apperance of single node
/*
example size,colour ,text-size,text-colour and other features
*/

// Get the reference to the instruction panel div
const instructionPanel = document.querySelector('.instruction-panel');

// Function to add an instruction to the panel
function addInstruction(instruction) {
    instructionPanel.innerText += instruction + '\n';
}
class Node {

    static sizes = 30; // diameter of node
    static nodecolour = "#FFD700"; // inside colour of node
    static stroke_colour = "#333"; // outline colour of node
    static text_size = 10; // Value of text size of node
    static text_colour = "#333" // colour of node text
    static edge_colour = "#000";   // Color of this node's upper edge
    static edge_weight = 2;            // Thickness this node's upper edge 


    static visit = "#00F";  // Color when this node has been visited
    static success = "#0F0";  // Color when this node was added/the
    static searced = "#F00"; // value for searched

    // Constants controlling the positions of the nodes relative to one another
    static HORIZONTALSPACING = 15; // Horizontal distance between two nodes
    static VERTICALSPACING = 50;   // Vertical distance between tow nodes

    static searchColor1 = 'yellow';
    static searchColor2 = 'orange';


    // code for constructor
    constructor(graphicsBuffer, parent = null, size = Node.sizes,
        color = Node.nodecolour, stroke = Node.stroke_colour,
        textSize = Node.text_size, textColor = Node.text_colour,
        edgeColor = Node.edge_colour,
        edgeThickness = Node.edge_weight) {

        this.value = null;     // The value this node is holding

        // Reference to left/right children on this node
        this.leftNode = null;
        this.rightNode = null;

        // The off-screen buffer this node should draw itself to
        this.graphicsBuffer = graphicsBuffer;

        // A reference to the parent for drawing purposes
        this.parent = parent;

        // x and y coordinates to draw the node at
        this.x = 0;
        this.y = 0;

        // The horizontal space between this node and its left/right children
        this.rightSpacing = 0;
        this.leftSpacing = 0;

        // The total horizontal space all nodes below this node use in either direction
        this.cumulativeRightSpacing = 0;
        this.cumulativeLeftSpacing = 0;

        // Properties controlling the appearance of the node
        this.size = size;
        this.color = color;
        this.stroke = stroke;
        this.textSize = textSize;
        this.textColor = textColor;

        // Properties controlling the appearance of the upper edge of this node
        this.edgeColor = edgeColor;
        this.edgeThickness = edgeThickness;

    }
    //end of constructor

    // Definition of a "filled" node that should be processed recursively
    isFilled() {
        return this.value !== null;
    }

    // Checks if a node has a parent, or is the root of a tree
    hasParent() {
        return this.parent !== null;
    }
    addValue(value) {
        if (!this.isFilled()) {
            // If the node hasn't been filled yet, fill this node with the value
            // This node needs to have its coordinates set, to return this

            this.value = value;
            this.leftNode = new Node(this.graphicsBuffer, this);
            this.rightNode = new Node(this.graphicsBuffer, this);
            addInstruction(`Adding value ${value} to the tree.`);
            return this;

        } else {
            let compareResult = this.compareValues(value);

            if (compareResult === 0) {
                // The value is equal to this node's value, handle duplicates based on your preference
                // For example, you can ignore duplicates or insert them to the left or right child.
                // In this case, we'll ignore duplicates.
                addInstruction(`Value ${value} is already present in the tree. Ignoring duplicate.`);
                return this;
            } else if (compareResult < 0) {
                // The value is less than this node's value, so it belongs to the left

                let initialLeftSpacing = this.leftNode.cumulativeRightSpacing + Node.HORIZONTALSPACING;

                // Add this value to the left half of the tree
                let shiftedNode = this.leftNode.addValue(value);

                // To prevent overlapping nodes, the left child should be offset
                // slightly farther to the left than all the space taken up to the
                // right of the left node
                this.leftSpacing = this.leftNode.cumulativeRightSpacing + Node.HORIZONTALSPACING;

                // Update total spacing taken up to the left of this node
                this.cumulativeLeftSpacing = this.leftNode.cumulativeLeftSpacing + this.leftSpacing;

                // If this node's left spacing changed, then the coordinates of its
                // left child must be updated to account for this change, so return
                // the left child
                if (this.leftSpacing !== initialLeftSpacing) {
                    addInstruction(`Shifting left subtree due to insertion of ${value}.`);
                    return this.leftNode;
                }

                // If the left spacing didn't change, return the lower node that
                // needs to be adjusted
                return shiftedNode;

            } else if (compareResult > 0) {
                // The value is greater than this node's value, so it belongs to the left

                // The code below parallels the code above, but handles adding nodes
                // to the right half of this node

                let rightSpacing = this.rightNode.cumulativeLeftSpacing + Node.HORIZONTALSPACING;

                let shiftedNode = this.rightNode.addValue(value);

                this.rightSpacing = this.rightNode.cumulativeLeftSpacing + Node.HORIZONTALSPACING;

                this.cumulativeRightSpacing = this.rightNode.cumulativeRightSpacing + this.rightSpacing;

                if (this.rightSpacing !== rightSpacing) {
                    addInstruction(`Shifting right subtree due to insertion of ${value}.`);
                    return this.rightNode;
                }

                return shiftedNode;
            }
        }
    }


    compareValues(value) {
        if (typeof this.value === 'number' && typeof value === 'number') {
            // Compare two numbers
            return value - this.value;
        } else if (typeof this.value === 'string' && typeof value === 'string') {
            // Compare two strings using localeCompare for alphabetical comparison
            return this.value.localeCompare(value);
        } else if (typeof this.value === 'string' && typeof value === 'number') {
            // If the current node's value is a string and the value to be inserted is a number,
            // consider the string greater than the number.
            return 1;
        } else if (typeof this.value === 'number' && typeof value === 'string') {
            // If the current node's value is a number and the value to be inserted is a string,
            // consider the string smaller than the number.
            return -1;
        } else if (typeof this.value === 'string' && typeof value === 'symbol') {
            // If the current node's value is a string and the value to be inserted is a symbol,
            // consider the string greater than the symbol.
            return 1;
        } else if (typeof this.value === 'symbol' && typeof value === 'string') {
            // If the current node's value is a symbol and the value to be inserted is a string,
            // consider the symbol smaller than the string.
            return -1;
        } else if (typeof this.value === 'symbol' && typeof value === 'symbol') {
            // Compare two symbols using their description
            return this.value.description.localeCompare(value.description);
        } else if (typeof this.value === 'string' && typeof value === 'boolean') {
            // If the current node's value is a string and the value to be inserted is a boolean,
            // consider the string greater than the boolean.
            return 1;
        } else if (typeof this.value === 'boolean' && typeof value === 'string') {
            // If the current node's value is a boolean and the value to be inserted is a string,
            // consider the boolean smaller than the string.
            return -1;
        } else if (typeof this.value === 'boolean' && typeof value === 'boolean') {
            // Compare two booleans (true > false)
            return this.value === value ? 0 : (this.value ? 1 : -1);
        } else if (typeof this.value === 'string' && typeof value === 'object') {
            // If the current node's value is a string and the value to be inserted is an object,
            // consider the string greater than the object.
            return 1;
        } else if (typeof this.value === 'object' && typeof value === 'string') {
            // If the current node's value is an object and the value to be inserted is a string,
            // consider the object smaller than the string.
            return -1;
        } else {
            // If the values are of different data types that we haven't handled,
            // consider them equal (considering as duplicate)
            return 0;
        }
    }


    delete(value) {
        if (!this.isFilled()) {
            addInstruction(`Value ${value} not found in the tree. Deletion failed.`);
            return false;
        }
        else if (value === this.value) {
            // Case 1: Node to be deleted has no children
            if (!this.leftNode.isFilled() && !this.rightNode.isFilled()) {
                addInstruction(`Node with value ${value} found. Deleting the node (Case 1: Node has no children).`);
                this.value = null;
                this.leftNode = null;
                this.rightNode = null;
                return true;
            }
            // Case 2: Node to be deleted has one child
            else if (!this.leftNode.isFilled() || !this.rightNode.isFilled()) {
                const childNode = this.leftNode.isFilled() ? this.leftNode : this.rightNode;
                addInstruction(`Node with value ${value} found. Deleting the node (Case 2: Node has one child).`);
                this.value = childNode.value;
                this.leftNode = childNode.leftNode;
                this.rightNode = childNode.rightNode;
                return true;
            }
            // Case 3: Node to be deleted has two children
            else {
                addInstruction(`Node with value ${value} found. Deleting the node (Case 3: Node has two children).`);
                // Find the in-order successor (the smallest value in the right subtree)
                let inOrderSuccessor = this.rightNode;
                while (inOrderSuccessor.leftNode.isFilled()) {
                    inOrderSuccessor = inOrderSuccessor.leftNode;
                }
                // Replace the value of this node with the in-order successor value
                this.value = inOrderSuccessor.value;
                // Delete the in-order successor node
                this.rightNode = this.rightNode.delete(inOrderSuccessor.value);
                return true;
            }
        }
        else if (value < this.value) {
            addInstruction(`Searching for value ${value} in the left subtree.`);
            if (this.leftNode.isFilled()) {
                this.leftNode = this.leftNode.delete(value);
            } else {
                addInstruction(`Value ${value} not found in the tree. Deletion failed.`);
                return false;
            }
        }
        else if (value > this.value) {
            addInstruction(`Searching for value ${value} in the right subtree.`);
            if (this.rightNode.isFilled()) {
                this.rightNode = this.rightNode.delete(value);
            } else {
                addInstruction(`Value ${value} not found in the tree. Deletion failed.`);
                return false;
            }
        }
        return this;
    }
    // Recursively sets the coordinates of this node and all nodes below it.
    // If no coordinates are supplied, the coordinates are based on the parent
    // node's location and spacing. If coordinates are supplied, the coordinates
    // are se to the specified values.
    // This function is called by the Tree class after a value is inserted
    // to position the nodes in the tree correctly
    setCoordinates(x, y) {
        if (this.isFilled()) {
            if (typeof x === "undefined" && typeof y === "undefined") {
                // No coordinates were passed into the function
                if (this.value < this.parent.value) {
                    // Left node
                    this.x = this.parent.x - this.parent.leftSpacing;
                } else {
                    // Right node
                    this.x = this.parent.x + this.parent.rightSpacing;
                }

                this.y = this.parent.y + Node.VERTICALSPACING;

            } else {
                // Coordinates were passed into the function
                this.x = x;
                this.y = y;
            }

            this.leftNode.setCoordinates();
            this.rightNode.setCoordinates();
        }
    }

    /***
     * Recursively searches the tree for the specified value
     *
     * Returns: Boolean; if value was found in the tree (true) or not (false)
    ***/
    search(value, blinkDuration = 3000, blinkColor1 = searchColor1, blinkColor2 = searchColor2) {
        if (!this.isFilled()) {
            addInstruction(`Value ${value} not found in the tree.`);
            return false;
        }
        else if (this.value === value) {
            // Perform the blinking effect when the value is found
            this.blink(blinkDuration, blinkColor1, blinkColor2);
            addInstruction(`Value ${value} found in the tree.`);
            return true;

        }
        else if (value < this.value) {
            addInstruction(`Searching for value ${value} in the left subtree.`);
            return this.leftNode.search(value, blinkDuration, blinkColor1, blinkColor2);
        }
        else if (value > this.value) {
            addInstruction(`Searching for value ${value} in the right subtree.`);
            return this.rightNode.search(value, blinkDuration, blinkColor1, blinkColor2);
        }
    }


    // this function blink the nodes which was present during searching
    blink(duration, color1, color2) {
        const startTime = Date.now();
        const intervalId = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress >= 1) {
                clearInterval(intervalId);
                this.paint(color1); // Set the color back to the original color
            } else {
                // Switch between the two colors based on the progress
                if (Math.floor(progress * 10) % 2 === 0) {
                    this.paint(color1);
                } else {
                    this.paint(color2);
                }
            }
        }, 100);
    }


    // Draws this node's upper level edge, if the node has a parent
    drawEdge() {
        if (this.hasParent()) {
            this.graphicsBuffer.stroke(this.edgeColor);
            this.graphicsBuffer.strokeWeight(this.edgeThickness);
            this.graphicsBuffer.line(this.x, this.y, this.parent.x, this.parent.y);
        }
    }

    // Draws this node's circular face
    drawNode() {
        this.graphicsBuffer.fill(this.color);
        this.graphicsBuffer.stroke(this.stroke);
        this.graphicsBuffer.ellipse(this.x, this.y, this.size, this.size);
        this.graphicsBuffer.noStroke();
        this.graphicsBuffer.fill(this.textColor);
        this.graphicsBuffer.textAlign(CENTER, CENTER);
        this.graphicsBuffer.textSize(this.textSize);
        this.graphicsBuffer.text(this.value, this.x, this.y + 1);
    }

    // Redraws a singular node on the tree with no side-effects
    redraw() {
        if (this.isFilled()) {
            this.drawEdge();

            this.drawNode();

            if (this.hasParent()) {
                this.parent.drawNode();
            }
        }
    }

    // Recursively sets the color and edge color of this node and all nodes
    // below it to the specified color
    recursivePaint(color) {
        if (this.isFilled()) {
            this.color = color;
            this.edgeColor = color;

            this.leftNode.recursivePaint(color);
            this.rightNode.recursivePaint(color);
        }
    }

    // Sets the color and edge color of this node, and redraws the node
    paint(color) {
        this.color = color;
        this.edgeColor = color;

        this.redraw();
    }

    // Recursively set the appearnace of this node and all nodes below it to
    // defaults for the class
    resetVisuals() {
        if (this.isFilled()) {
            this.size = Node.SIZE;
            this.color = Node.COLOR;
            this.stroke = Node.STROKE;
            this.textSize = Node.TEXTSIZE;
            this.textColor = Node.TEXTCOLOR;

            this.edgeColor = Node.EDGECOLOR;
            this.edgeThickness = Node.EDGETHICKNESS;

            this.leftNode.resetVisuals();
            this.rightNode.resetVisuals();
        }
    }
}


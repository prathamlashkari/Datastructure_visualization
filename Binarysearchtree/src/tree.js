/***
 * Tree.js
 *
 * This file defines the Tree class. The Tree class serves as a wrapper for a
 * root node, wrapping methods such as addValue or search, but also provides
 * higher-level functionality, such as setting the coordinates of the entire
 * tree, or drawing the entire tree.
 *
 * The tree class is also responsible for animating itself, and relies only
 * on an instance of the Controls class to provide the interval between frames
 * of animation
***/

class Tree {
    constructor(x, y, backgroundColor) {
        // The buffer that this tree, and all the nodes in the tree draw to
        this.graphicsBuffer = createGraphics(CANVASWIDTH, CANVASHEIGHT);

        // The root node; the upper level node of a binary tree
        this.root = new Node(this.graphicsBuffer);

        // A reference to a Controls instance
        this.controls = null;

        // The x and y coordinate that the root node is drawn at
        this.x = x;
        this.y = y;

        // The background color of the tree visualization
        this.backgroundColor = backgroundColor;

        // Various properties for tracking animations
        this.running = false; // Whether or not an animation is running
        this.timeout = null;  // The current timeout, so animations can be cancelled
        this.node = null;     // The current node being animated
        this.draw();
        this.traversalData = [];
        this.treeHeight =0 ;
    }

     // Calculate the height of the tree recursively
     calculateHeight(node = this.root) {
        if (!node.isFilled()) {
            return 0;
        }

        const leftHeight = this.calculateHeight(node.leftNode);
        const rightHeight = this.calculateHeight(node.rightNode);

        return 1 + Math.max(leftHeight, rightHeight);
    }

    // Update the tree height and display it
    updateTreeHeight() {
        this.treeHeight = this.calculateHeight();
        const heightDiv = document.querySelector('.height-data');
        heightDiv.textContent = `${this.treeHeight}`;
    }


    // Sets this instance's reference to a Controls instance so that an
    // animation interval can be set
    bindControls(controls) {
        this.controls = controls;
    }

    // Resets the root node to an empty node, effectively clearing all nodes
    clear() {
        this.root = new Node(this.graphicsBuffer);
    }

    // Returns: a random number in the range [0, max) not yet in the tree
    uniqueRandom(max) {
        while (true) {
            var value = Math.floor(random(0, max));

            if (!this.search(value)) {
                return value;
            }
        }
    }

    // Quickly fills the tree with a certain number of nodes
    fill(count) {
        this.clear();

        for (var i = 0; i < count; i++) {
            var value = this.uniqueRandom(count);

            this.addValue(value);
        }

        this.draw();
    }

    // Wraps the Node class's addValue method, and sets the coordinate of the
    // subset of the tree that needs to be adjusted after the value was added
    addValue(value) {
        var shiftedNode = this.root.addValue(value);
        this.setCoordinates(shiftedNode);
        this.updateTreeHeight(); // Update the tree height after adding a value
    }

    // Wraps the Node class's search method directly
    search(value) {
        return this.root.search(value);
    }

    // Wraps the Node class's setCoordinates method. Sets the root's position
    // to the x and y coordinates of the tree, or allows nodes to determine
    // their own position based off their parents (by passing no arguments)
    setCoordinates(node) {
        if (node === this.root) {
            node.setCoordinates(this.x, this.y);
        } else {
            node.setCoordinates();
        }
    }

    // Draws the entire visulizatino, including the background, and each node
    draw() {
        this.graphicsBuffer.background(this.backgroundColor);

        if (this.root.isFilled()) {
            this.root.draw();
        }

        this.updateDrawing();
    }

    // Displays the tree without redrawing every node in the tree
    // This function is used when the color of singular nodes are updated
    updateDrawing() {
        image(this.graphicsBuffer, 0, 0);
    }

    // Wraps the Node class's resetVisuals method, and draws the result
    resetVisuals() {
        this.root.resetVisuals();

        this.draw();
    }

    // The first function called before an animation. Checks that no animation
    // is currently running, and then initializes various properties to track
    // the progress of the animation
    // The frame argument is a function representing one frame of the animation
    startAnimation(frame, ...args) {
        if (this.running) {
            throw Error('Animation is currently running');
        } else {
            this.running = true;
            this.node = this.root;

            this.resetVisuals();

            // Bind the frame method here so it doesn't have to be bound
            // when it is passed as an argument
            this.continueAnimation(frame.bind(this), ...args)
        }
    }

    // Schedules the next frame of the animation
    continueAnimation(frame, ...args) {
        // Bind the frame function inside the method, so it doesnt have to be
        // bound as an arguemtn
        this.timeout = setTimeout(() => frame.bind(this)(...args),
            this.controls.animationInterval);
    }

    // The last function called to end an animation. Resets various properties
    // tracking the progression of the animation so that a new animation can be
    // run, and runs a specified function with specified arguments when the
    // animation is complete
    stopAnimation(complete = () => { }, ...callbackArgs) {
        this.running = false;
        this.node = null;

        clearTimeout(this.timeout);

        setTimeout(() => complete(...callbackArgs), this.controls.animationInterval);
    }

    // Call for starting an addValue animation
    // value is the value to add
    // complete is a callback called when the animation finishes
    addValueVisual(value, complete = () => { }, ...callbackArgs) {
        this.startAnimation(this.addValueFrame, value, complete, ...callbackArgs);
    }

    // Single frame for the addValue animation
    // Arguments match addValueVisual
    addValueFrame(value, complete, ...callbackArgs) {
        if (!this.node.isFilled()) {
            this.addValue(value);          // Add the value to the data structure

            // this.node.paint(Node.SUCCESS); // Mark this node as inserted

            this.draw();                   // Show the tree with the new value
            this.stopAnimation(complete, ...callbackArgs);

        } else {
            this.node.paint(Node.VISITED); // Mark this node as visited

            this.updateDrawing();          // Display the new color

            // Determine the node for the next frame
            if (value < this.node.value) {
                this.node = this.node.leftNode;

            } else if (value > this.node.value) {
                this.node = this.node.rightNode;
            }

            // Schedule the next frame, passing in all arguments for the next call
            this.continueAnimation(this.addValueFrame, value, complete, ...callbackArgs)
        }
    }


    // Call for starting the search animation
    // value is the value to search for
    // complete is a callback called when the animation finishes
    searchVisual(value, complete = () => { }, ...callbackArgs) {
        this.startAnimation(this.searchFrame, value, complete, ...callbackArgs);
        console.log('searching visually')
    }

    // Single frame for the search animatino
    // Arugment match serchVisual
    searchFrame(value, complete, ...callbackArgs) {
        if (this.node.color !== Node.VISITED) {
            // Mark the root node as visited first, then continue the search
            this.root.paint(Node.VISITED);

            this.updateDrawing();

            this.continueAnimation(this.searchFrame, value, complete, ...callbackArgs);

        } else if (!this.node.isFilled()) {
            // The value isn't in the tree, stop the animation
            Node.addinstrunction(` Value ${value} not found in binary search tree.... \n`)
            this.stopAnimation(complete, ...callbackArgs);

        } else if (this.node.value === value) {
            // The value is in this node
            // Mark the node as found
            this.node.paint(Node.SUCCESS);  // Mark the node as found
            this.updateDrawing();           // Display the new color
            this.stopAnimation(complete, ...callbackArgs);
            Node.addinstrunction(` Value ${value} found successfully  in the tree.... \n`)

        } else {
            // The value may be in another node

            var nextHalf; // The half of the tree being searched next
            var cutHalf;  // The hal of the tree that can be cut from search

            // Set the two variables correctly
            if (value < this.node.value) {
                nextHalf = this.node.leftNode;
                cutHalf = this.node.rightNode;

            } else if (value > this.node.value) {
                nextHalf = this.node.rightNode;
                cutHalf = this.node.leftNode;
            }

            // Set the node for the next frame
            this.node = nextHalf;

            // Mark the half of the tree the node is not in, draw it
            cutHalf.recursivePaint(Node.FAILURE);
            cutHalf.draw();

            // Mark the next node as visited
            nextHalf.paint(Node.VISITED);

            // Display all the changes
            this.updateDrawing();

            this.continueAnimation(this.searchFrame, value, complete, ...callbackArgs);
        }
    }

    // traveral section 
    // Recursive in-order traversal method
    inOrderTraversal(node, callback) {
        if (node.isFilled()) {
            this.inOrderTraversal(node.leftNode, callback);
            callback(node);
            this.inOrderTraversal(node.rightNode, callback);
        }
    }

    // Recursive pre-order traversal method
    preOrderTraversal(node, callback) {
        if (node.isFilled()) {
            callback(node);
            this.preOrderTraversal(node.leftNode, callback);
            this.preOrderTraversal(node.rightNode, callback);
        }
    }

    // Recursive post-order traversal method
    postOrderTraversal(node, callback) {
        if (node.isFilled()) {
            this.postOrderTraversal(node.leftNode, callback);
            this.postOrderTraversal(node.rightNode, callback);
            callback(node);
        }
    }

    // ...


    // Call for starting the in-order traversal animation
    inOrderTraversalVisual(complete = () => { }) {
        this.traversalData = []; // Clear previous traversal data
        this.startAnimation(() => this.inOrderTraversalFrame(this.root, complete));
    }

    // Call for starting the pre-order traversal animation
    preOrderTraversalVisual(complete = () => { }) {
        this.traversalData = []; // Clear previous traversal data
        this.startAnimation(() => this.preOrderTraversalFrame(this.root, complete));
    }

    // Call for starting the post-order traversal animation
    postOrderTraversalVisual(complete = () => { }) {
        this.traversalData = []; // Clear previous traversal data
        this.startAnimation(() => this.postOrderTraversalFrame(this.root, complete));
    }

    // ...

    // Single frame for in-order traversal animation
    inOrderTraversalFrame(node, complete) {
        this.traversalFrame(node, complete, this.inOrderTraversal.bind(this));
    }

    // Single frame for pre-order traversal animation
    preOrderTraversalFrame(node, complete) {
        this.traversalFrame(node, complete, this.preOrderTraversal.bind(this));
    }

    // Single frame for post-order traversal animation
    postOrderTraversalFrame(node, complete) {
        this.traversalFrame(node, complete, this.postOrderTraversal.bind(this));
    }

    // Single frame for traversal animations
    traversalFrame(node, complete, traversalMethod) {
        if (!node || !node.isFilled() || !this.running) {
            // Traversal complete, node is empty, or animation was stopped, stop the animation
            this.stopAnimation(() => {
                this.traversalData = this.traversalData; // Update traversal data in the Tree instance
                Node.addinstrunction(`Traversal complete in binary search tree....`);
                complete();
            });
            return;
        }
    
        // Traverse the current node and accumulate data
        traversalMethod(node, (node) => {
            if (!this.traversalData.includes(node.value)) {
                Node.addinstrunction(`Visiting the node ${node.value} in binary search tree.... `)
                this.traversalData.push(node.value);
            }
            node.paint(Node.VISITED);
            this.updateDrawing();
        });
    
        // Schedule the next frame with the next node in the traversal
        this.continueAnimation(() => {
            this.traversalFrame(this.findNextNode(node), complete, traversalMethod);
        });
    }
    

    // Helper method to find the next node in the traversal
    findNextNode(node) {
        if (node.leftNode && node.leftNode.isFilled()) {
            return node.leftNode;
        } else if (node.rightNode && node.rightNode.isFilled()) {
            return node.rightNode;
        }
        return null;
    }

}

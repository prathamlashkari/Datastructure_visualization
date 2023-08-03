/***
 * Controls.js
 *
 * Thie file defines the Controls class, which provides a friendly button-based
 * interface to the Tree class's animation methods
 *
 * The Tree class relies on the Controls "animationInterval" property to set
 * the time in between animation frames
***/
class Controls {
    // Using the static keyword to define readable class constants

    // Constants for the ids of various user interface elements
    static insert = "insert-btn";
    static delete = "delete-btn";
    static traversal = "traversal-btn";
    static SEARCHID = "search-btn";
    static SLIDERID = "speed";
    static clearbtn = "clear-btn";

    // The number of nodes above which the user will be warned before running
    // "Fill" or "Quick Fill"
    static NODELIMIT = 500
    constructor(tree) {
        this.tree = tree;
        this.tree.bindControls(this);  // Provide the tree a reference to this class

        this.animationInterval = null; // Property Tree class relies on for animation

        // Store all of the user interface elements based on the IDs
        this.inserts = document.getElementById(Controls.insert);
        this.clearbtns = document.getElementById(Controls.clearbtn);
        this.deleteopt = document.getElementById(Controls.delete);
        this.traversals = document.getElementById(Controls.traversal);
        this.searchBtn = document.getElementById(Controls.SEARCHID);
        this.speedSlider = document.getElementById(Controls.SLIDERID);

        // Set the animation interval based on the slider's value
        this.setAnimationSpeed();

        // Append event listeners to run each animation
        this.inserts.addEventListener('click',
            () => this.triggerAnimation(this.add));
        this.clearbtns.addEventListener('click',
            () => this.triggerAnimation(this.clear));
        // this.deleteopt.addEventListener('click',
        //     () => this.triggerAnimation(this.deletes));
        // this.traversals.addEventListener('click',
        // () => this.triggerAnimation(this.traverse));
        this.searchBtn.addEventListener('click',
            () => this.triggerAnimation(this.search));

        // Append an event listener to change the animation interval
        this.speedSlider.addEventListener('input', this.setAnimationSpeed.bind(this));
    }

    // Completly resets the tree, removing all nodes, stopping all animations
    clear() {
        this.tree.clear();
        this.tree.stopAnimation(() => { })
        this.tree.draw();
        const instructionsD = document.querySelector('.instrunction-data');
        instructionsD.textContent = '';
    }

    // Called by event listeners to run a certain animation if one is not running
    triggerAnimation(animation) {
        if (this.tree.running) {
            alert('Please wait for the current animation to finish');
        } else {
            // Bind the animation here so it doesn't have to be bound as an argument
            animation.bind(this)();
        }
    }

    // Prompts the user with a given piece of text
    // Returns: null               => if no valid number was entered
    //          postive integer    => if a valid positive integer is provided
    getNumber() {
        const valueInput = document.querySelector('#value');
        const value = parseInt(valueInput.value);
        if (value === null) {
            return null;
        } else if (isNaN(parseInt(value)) || value === "" || parseInt(value) < 0) {
            alert('Please enter a positive integer');
            return null;
        } else {
            valueInput.value = ''; // Clear the input field after insertion
            return parseInt(value);
        }
    }

    // Method for the Quick Fill animation
    quickFill() {
        var count = this.getNumber("Number of nodes: ");

        if (count !== null && (count < Controls.NODELIMIT ||
            confirm(count + ' nodes may reduce performance. Continue anyways?'))) {
            this.tree.fill(count);
        }
    }

    // Method for the Fill animation
    slowFill() {
        var count = this.getNumber("Number of nodes: ");

        if (count !== null && (count < Controls.NODELIMIT ||
            confirm(count + ' nodes may reduce performance. Continue anyways?'))) {
            this.tree.fillVisual(count);
        }
    }

    // Method for the Add animation
    add() {
        var value = this.getNumber();
        // var value = this.insertValue()

        if (value !== null && this.tree.search(value)) {
            alert(value + ' is already in the tree');
        } else if (value !== null) {
            this.tree.addValueVisual(value);
            Node.addinstrunction(`Adding value ${value} to the binary search tree.....`)
        }
    }
    
    // Method for the search animation
    search() {
        var value = this.getNumber();

        if (value !== null) {
            this.tree.searchVisual(value)
            Node.addinstrunction(`Searching for value ${value} in the binary tree...`)

        }
    }

    // Inverts and exponentiates the linear output of the slider to set the interval
    setAnimationSpeed() {
        this.animationInterval = 1000 / Math.pow(10, this.speedSlider.value);
    }
}

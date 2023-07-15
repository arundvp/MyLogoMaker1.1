// Imports the graceful-fs, inquirer, Circle, Square, and Triangle modules.
const {Circle, Square, Triangle} = require("./lib/shapes");
const filesystem = require("graceful-fs")
const inquirer = require("inquirer");
const fs = require('fs');
const path = require('path');

// Defines a Svg class that has a constructor with three methods for rendering and setting the text and shape elements in the SVG string.

class Svg{
    constructor(){
        this.textElement = ''
        this.shapeElement = ''
    }
    render(){
        return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="300" height="200">${this.shapeElement}${this.textElement}</svg>`
    }
    setTextElement(text,color){
        this.textElement = `<text x="150" y="125" font-size="60" text-anchor="middle" fill="${color}">${text}</text>`
    }
    setShapeElement(shape){
        this.shapeElement = shape.render()

    }
    
}

// Defines an array of questions for the user to answer.
// Defines a function to write the data to a file.
const questions = [
    {
        type: "input",
        name: "text",
        message: "TEXT: Enter up to (3) Characters:",
    },
    {
        type: "input",
        name: "text-color",
        message: "TEXT COLOR: Enter a color keyword (OR a hexadecimal number):",
    },
    {
        type: "input",
        name: "shape-color",
        message: "SHAPE COLOR: Enter a color keyword (OR a hexadecimal number):",
    },
    {
        type: "list",
        name: "shape-type",
        message: "Choose which Pixel Image you would like?",
        choices: ["Circle", "Square", "Triangle"],
    },
];

// Function to write data to file
const directory = 'mylogos';
function writeToFile(directory, fileName, data) {
	const filePath = path.join(directory, fileName);
	fs.writeFile(filePath, data, function (err) {
	  if (err) {
		return console.log(err);
	  }
	  console.log("Congratulations, you have generated a logo in the directory: " + directory);
	});
  }

// Function to initialize app

async function myLogoGenerator() {
	console.log("Starting My Logo Generator...");
	var svgString = "";
	var svg_file = "mylogo";
  
	// Prompt the user for answers
	const answers = await inquirer.prompt(questions);
  
	// User text input validation
	var user_text = "";
	if (answers.text.length > 0 && answers.text.length < 4) {
	  // 1-3 chars, valid entry
	  user_text = answers.text;
	} else {
	  // 0 or 4+ chars, invalid entry
	  console.log("Invalid user text field detected! Please enter 1-3 Characters, no more and no less");
	  return;
	}
	console.log("User text: [" + user_text + "]");
  
	// User font color
	user_font_color = answers["text-color"].toLowerCase();
	console.log("User font color: [" + user_font_color + "]");
  
	// User shape color
	user_shape_color = answers["shape-color"].toLowerCase();
	console.log("User shape color: [" + user_shape_color + "]");
  
	// User shape type
	user_shape_type = answers["shape-type"].toLowerCase();
	console.log("User entered shape = [" + user_shape_type + "]");
  
	// User shape
	let user_shape;
	if (user_shape_type === "square") {
	  user_shape = new Square();
	  console.log("User selected Square shape");
	} else if (user_shape_type === "circle") {
	  user_shape = new Circle();
	  console.log("User selected Circle shape");
	} else if (user_shape_type === "triangle") {
	  user_shape = new Triangle();
	  console.log("User selected Triangle shape");
	} else {
	  console.log("Invalid shape!");
	  return;
	}
	user_shape.setColor(user_shape_color);
  
	// Create a new Svg instance and add the shape and text elements to it
	var svg = new Svg();
	svg.setTextElement(user_text, user_font_color);
	svg.setShapeElement(user_shape);
	svgString = svg.render();
  
	// Print shape to log
	console.log("Displaying shape:\n\n" + svgString);
  
	// Append user's text input to the file name
	svg_file += "-" + user_text + ".svg";

	// Write the shape to a file
	console.log("Shape generation complete!");
	console.log("Writing shape to file...");
	writeToFile(directory, svg_file, svgString);
  }

// Function call to initialize app
myLogoGenerator();
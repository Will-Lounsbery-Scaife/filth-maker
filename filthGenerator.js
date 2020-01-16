var staffArray;
var staffArrayObj;
var dayArray = [];

// class for staff members
class StaffMember {
    
    name;
    lifeguard;x
    daysOff = [];
    newStaff;
    sx;
    head;
    dutied;
    kitchen_count;
    
    constructor(first, gen) {
        this.kitchen_count = 0;
        this.name = first;
        if (gen==0) {
            this.sx = 0;
        }
        if (gen==1) {
            this.sx = 1;
        }
    }
    
    get_Name() {
        return `${this.name}`;
    }

    add_DOP(nameDay) {
        this.daysOff.push(nameDay);
    }
}

class Day {
    
    dayID;
    number;
    DOPs;
    nonDOPs = [];
    bbh;
    gbh;
    lab;
    lib;
    rec;
    pool;
    kit;
    rb;
    rg;
    ts;
    slots;
    
    constructor(dopArray, sessionDay) {
        this.dayID = sessionDay;
        this.DOPs = dopArray;
        switch (sessionDay) {
            case "sunday1": case "sunday2": case "saturday2":
                this.slots = 4;
                break;
            case "friday2":
                this.slots = 10;
            default:
                this.slots = 15;
        }
        

        // if the day has no staff on DOP, adds all staff members to nonDOP
        if (dopArray.length == 0) {
            for (let i = 0; i < staffArray.length; i++) {
                this.nonDOPs.push(staffArray[i]);
            }
        }

        else {     
            // loops through the array of all Staff objects, and adds them to nonDOPs if they are not on DOP
            for (let numero = 0; numero < staffArrayObj.length; numero++) {
                let found = false;
                    
                for(let p = 0; p < this.DOPs.length; p++) {
                    if (staffArrayObj[numero].name == this.DOPs[p].name) {
                        found = true;
                        break;
                    }
                }

                if (found == false) {
                    this.nonDOPs.push(staffArray[numero]);
                }   
            }
        }       
    }
}


// fills the duties for the given session day
function fill_normal_day(date) {
    nonDOPs_copy = date.nonDOPs.slice(0);
    for (let i = 0; i < 15; i++) {

    }
    
    let backups = [];
}


// generates a random integer in the given range
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// function to make the "skeleton" of the table containing the filth
function makeTable () {

    // variables to determine number of rows and columns
   var rows = 29;
   var cols = 15;

   // sets the id of each cell of the table to a coordinate value: (a-z), (0-14)
   var myTable = document.getElementById('filthy');
   for (var r = 0; r<rows; r++){
        var row = myTable.insertRow(-1);
        for (let c = 0; c<cols; c++){
            var cell = row.insertCell(-1);
            var coordinates = c + ", " + 'abcdefghijklmnopqrstuvwxyz123'.charAt(r);
            cell.setAttribute('id', coordinates);
            cell.setAttribute('class', 'cell');
            
            // prints coordinates in each cell for testing
            document.getElementById(coordinates).innerHTML = coordinates;
        }
   }

   // puts text in the "static" data cells
   var allCells = document.getElementsByClassName('cell');
   for (let i = 0; i < allCells.length; i++) {
        var curCell = allCells[i].id
        var str;
        switch (curCell) {
            case "0, a":
                str = "FILTH";
                document.getElementById(curCell).innerHTML = str.bold();
                break;
            case "0, b":
                str = "ROSTER";
                document.getElementById(curCell).innerHTML = str.bold();
                break;
            case "0, c":
                document.getElementById(curCell).innerHTML = "session year";
                break;
            case "0, e":
                document.getElementById(curCell).innerHTML = "BBH";
                break;
            case "0, f":
                document.getElementById(curCell).innerHTML = "GBH";
                break;
            case "0, g":
                document.getElementById(curCell).innerHTML = "Lab";
                break;
            case "0, h":
                document.getElementById(curCell).innerHTML = "Library";
                break;
            case "0, i":
                document.getElementById(curCell).innerHTML = "Rec";
                break;
            case "0, l":
                document.getElementById(curCell).innerHTML = "Pool";
                break;
            case "0, n":
                document.getElementById(curCell).innerHTML = "Kitchen";
                break;
            case "0, q":
                document.getElementById(curCell).innerHTML = "Tablesetters";
                break;
            case "0, r":
                document.getElementById(curCell).innerHTML = "Lunch Grace";
                break;
            case "0, s":
                document.getElementById(curCell).innerHTML = "Dinner Grace";
                break;
            case "0, t":
                document.getElementById(curCell).innerHTML = "Ranger G";
                break;
            case "0, u":
                document.getElementById(curCell).innerHTML = "Ranger B";
                break;
            case "0, v":
                document.getElementById(curCell).innerHTML = "DOP";
                break;
            case "0, e":
                document.getElementById(curCell).innerHTML = "BBH";
                break;
            case "1, a":
                document.getElementById(curCell).innerHTML = "Sunday";
                break;
            case "2, a":
                document.getElementById(curCell).innerHTML = "Monday";
                break;
            case "3, a":
                document.getElementById(curCell).innerHTML = "Tuesday";
                break;
            case "4, a":
                document.getElementById(curCell).innerHTML = "Wednesday";
                break;
            case "5, a":
                document.getElementById(curCell).innerHTML = "Thursday";
                break;
            case "6, a":
                document.getElementById(curCell).innerHTML = "Friday";
                break;
            case "7, a":
                document.getElementById(curCell).innerHTML = "Saturday";
                break;
            case "8, a":
                document.getElementById(curCell).innerHTML = "Sunday";
                break;
            case "9, a":
                document.getElementById(curCell).innerHTML = "Monday";
                break;
            case "10, a":
                document.getElementById(curCell).innerHTML = "Tuesday";
                break;
            case "11, a":
                document.getElementById(curCell).innerHTML = "Wednesday";
                break;
            case "12, a":
                document.getElementById(curCell).innerHTML = "Thursday";
                break;
            case "13, a":
                document.getElementById(curCell).innerHTML = "Friday";
                break;
            case "14, a":
                document.getElementById(curCell).innerHTML = "Saturday";
                break;
            case "2, c": case "4, c": case "6, c": case "9, c": case "11, c":
                document.getElementById(curCell).innerHTML = "minor";
                break;
            case "3, c": case "5, c": case "7, c": case "10, c": case "12, c":
                document.getElementById(curCell).innerHTML = "major";
                break;
            case "1, s":
                document.getElementById(curCell).innerHTML = "Flip";
                break;
       }
   }
}



// create a day object for each day in the session, and add the DOPs to each day based on form answers
function generate_DOPs() {

    // collection of all the multiple select inputs asking for DOPs of each day
    let inputElements_DOPs = document.getElementsByClassName("selectDOP");
    
    // HTMLCOllection to store the strings of staff names for each Day's DOPs
    let collectionStringDOPs;

    // array to store the strings of staff names for each Day's DOPs
    let arrayStringDOPs = [];

    // array to store the staff objects for each Day's DOPs
    let arrayStaffDOPs = [];
    
    // array to store all the day objects of the session
    let sessionDays = [];

    let dayName;
    let stringName;
    

    // loops through all the multi select forms
    for (let i=0; i < inputElements_DOPs.length; i++) {
        
        dayName = inputElements_DOPs[i].id;
        
        collectionStringDOPs = inputElements_DOPs[i].selectedOptions;

        // adds a day with no DOPs if none were entered for that day
        if (collectionStringDOPs.length == 0) {
            dayArray.push(new Day([], dayName));
            document.getElementById("showDOP1").innerHTML += "No DOPs <br>"

            for (let y = 0; y < dayArray[i].nonDOPs.length; y++) {
                document.getElementById("showDOP1").innerHTML += dayArray[i].nonDOPs[y] + " ";
            }
            document.getElementById("showDOP1").innerHTML += "<br> <br>";
            
            continue;
        }
        
        //  loops through the selected names in each select element and puts them in an array
        for (let x = 0; x < collectionStringDOPs.length; x++) {
            // resets the array of strings
            if (x == 0) {arrayStringDOPs = []}

            arrayStringDOPs.push(collectionStringDOPs[x].text);
        }
        

        // loops through the array of names
        for (let k = 0; k < arrayStringDOPs.length; k++) {      

            // resets the array of Staff objects
            if (k==0) {arrayStaffDOPs = []}
            
            // loops through the the array of all Staff objects 
            for (let j = 0; j < staffArrayObj.length; j++) {
                
                stringName = staffArrayObj[j].name;
                
                // compares the current name in the array of selected names to each name in the array of all Staff
                if (arrayStringDOPs[k] == stringName) {
                    
                    
                    arrayStaffDOPs.push(staffArrayObj[j]);
                }
            }
            
        }

        dayArray.push(new Day(arrayStaffDOPs, dayName));
        
        // prints out DOPs for each day
        for (let z = 0; z < arrayStaffDOPs.length; z++) {  
            document.getElementById("showDOP1").innerHTML += arrayStaffDOPs[z].name + " ";
        }
        document.getElementById("showDOP1").innerHTML += "<br>";
        
        for (let y = 0; y < dayArray[i].nonDOPs.length; y++) {
            document.getElementById("showDOP1").innerHTML += dayArray[i].nonDOPs[y] + " ";
        }
        
        document.getElementById("showDOP1").innerHTML += "<br>";
        document.getElementById("showDOP1").innerHTML += "<br>";
        
        
    }
    window.localStorage.setItem('dayStorage', JSON.stringify(dayArray));
}


// fills the days off at the bottom of the filth for each day
function display_DOPs() {
    let dayArray2 = window.localStorage.getItem('dayStorage');
    dayArray2 = JSON.parse(dayArray2);
    //document.getElementById("daysOff").innerHTML += dayArray2[0].DOPs[0].name;

    for (let i = 0; i < dayArray2.length;i++) {
        for (let k = 0; k < dayArray2[i].DOPs.length; k++) {
            document.getElementById("daysOff").innerHTML += dayArray2[i].DOPs[k].name + ", ";
        }
        document.getElementById("daysOff").innerHTML += "<br>";
    }

    for (let c = 0; c < dayArray2.length; c++) {
        for (let r = 0; r < dayArray2[r].DOPs.length; r++) {
            if (r > 8) {
                continue;
            }
            
        }
    }
    
}


function show_staff_lists() {
    let msString = window.localStorage.getItem('maleStaff');
    let fsString = window.localStorage.getItem('femStaff');

    // make arrays out of the string of names
    let msArr = msString.split(',');
    let fsArr = fsString.split(',');

    // create an array with all names of staff
    let allArr = [];
    for (let i = 0; i<msArr.length; i++) {
        allArr.push(msArr[i]);
    }
    for (let i = 0; i<fsArr.length; i++) {
        allArr.push(fsArr[i]);
    }

    
    // create object arrays for male staff, fem staff, and both
    let msArrObj = [];
    let fsArrObj = [];
    let allArrObj = [];
    
    for (n = 0; n<msArr.length; n++) {
        msArrObj.push(new StaffMember(msArr[n], 0));
    }
    
    for (k = 0; k<fsArr.length; k++) {
        fsArrObj.push(new StaffMember(fsArr[k], 1));
    }
    
    for (i=0; i<msArrObj.length; i++) {
        allArrObj.push(msArrObj[i]);
    }
    
    for (j=0; j<fsArr.length; j++) {
        allArrObj.push(fsArrObj[j]);
    }
    
    

    staffArray = allArr;
    staffArrayObj = allArrObj;

    document.getElementById("maleStaffHere").innerHTML = "Male Staff: " + msArr;
    document.getElementById("femStaffHere").innerHTML = "Female Staff: " + fsArr;
    document.getElementById("allStaffHere").innerHTML = "All Staff: " + allArr;
    for (p = 0; p<allArrObj.length;p++) {
        document.getElementById("allObj").innerHTML += allArrObj[p].name + " ";
    }

}

function addOption(selectId) {

    let select = document.getElementById(selectId);
    
    for(let s = 0; s < staffArray.length; s++) {
        let mem = staffArray[s];
        let el = document.createElement("option");
        select.options[s] = new Option(staffArray[s], staffArray[s]);
        el.textContent = mem;
        el.value = mem;
    }
}


function validate(frm) {
    let ele = frm.elements['feedName[]'];
    let eleList = [];
    

    if (! ele.length) {
        //alert(ele.value);
	}
	for(let i=0; i<ele.length; i++) {
        eleList[i] = ele[i].value;
    }

    let ele1 = frm.elements['feedName1[]'];
    let eleList1 = [];
    if (! ele1.length) {
        //alert(ele.value);
	}
	for(let j=0; j<ele1.length; j++) {
        eleList1[j] = ele1[j].value;
    }
    document.getElementById("results").innerHTML += eleList + "<br>" + eleList1;
    let maleArray = Array.from(eleList);
    let femArray = Array.from(eleList1);
    window.localStorage.setItem('maleStaff', maleArray);
    window.localStorage.setItem('femStaff', femArray);
    return true;
}

// function to add a new input line for either a male or female staff member
function add_feed(gender){
    let div1;
    if(gender == 1) {
        div1 = document.createElement('div');
	    // Get template data
	    div1.innerHTML = document.getElementById('newName').innerHTML;
	    // append to our form, so that template data
	    //become part of form
        document.getElementById('newName1').appendChild(div1);
    }
    if(gender == 2) {
        div1 = document.createElement('div');
	    // Get template data
	    div1.innerHTML = document.getElementById('newName2').innerHTML;
	    // append to our form, so that template data
	    //become part of form
        document.getElementById('newName3').appendChild(div1);
    }
}
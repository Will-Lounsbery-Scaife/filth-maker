// TODO: 
// figure out the male/fem/neutral situation with BBH/GBH duties, and maybe make it so head counselors always have bunkhouse on the first day of the session
// once the bunkhouse duties are implemented, tie the grace duties to those duties
// make it so that staff members will not be assigned the same duty an excessive number of times, or multiple days in a row
// implement an option for second session, which will change the duties given on the 4th of July to reflect the schedule for that day 


// Global variables
// array of strings of all staff member names
var staffArray = [];
// array of every staff member object
var staffArrayObj = [];
// array of strings of each day name
var dayArray = [];
// array of every day object
var dayArray2;
// array of staff members that have "recently" been assigned kitchen
var recent_kitchens = [];
var staff_lg_array = [];

// class for staff member objects
class StaffMember {
    // name of staff member (string)
    name;

    // is the staff member a lifeguard (boolean)
    lifeguard;

    // which days off the staff member has (array of days)
    daysOff = [];

    // which duties this staff member has on which day (each item in array is [duty, dayID])
    duties = [];

    // is the staff member new
    newStaff;

    // are they male or fem staff
    sx;

    // are they a head counselor
    head;

    // keeps track of how many kitchens staff member has
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
        this.lifeguard = 0;
    }
    
    get_Name() {
        return `${this.name}`;
    }

    add_DOP(nameDay) {
        this.daysOff.push(nameDay);
    }
}


// class for day objects
class Day {
    // name of day 
    dayID;

    // number of day in the session
    dayNumber;

    // array of staff members who are at the DOP on this day
    DOPs;

    // array of staff members not at the DOP this day
    nonDOPs = [];

    // array of staff members to be pulled from for duties (starts the same as nonDOPs)
    pull_pool;

    // staff members assigned to a duty this day (duties with multiple assignees are arrays)
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
    
    constructor(dopArray, sessionDay, numb) {
        this.dayID = sessionDay;
        this.DOPs = dopArray;
        this.dayNumber = numb;
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
                this.nonDOPs.push(staffArrayObj[i]);
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
                    this.nonDOPs.push(staffArrayObj[numero]);
                }   
            }
        }
        this.pull_pool = this.nonDOPs;
    }
}


// class for duty objects
class Duty {
    
    // name of duty
    dutyID;
    // array of staff members that have been assigned this duty
    assignees = [];
    
    // constructor for duty object
    // dutyName is the name of the duty
    constructor (dutyName) {
        this.dutyID = dutyName;
    }
}


// generates a random integer in the given range
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return_value = Math.floor(Math.random() * (max - min + 1)) + min;
    //return Math.floor(Math.random() * (max - min + 1)) + min;
    return return_value;
}


// function to make the "skeleton" of the table containing the filth
function makeTable () {
    
    staffArray = [];
    staffArrayObj = [];

    lg_str = window.localStorage.getItem('lifeguardStorage');
    lg_arr = lg_str.split(',');

    //document.getElementById('LG').innerHTML += "Lifeguards:  ";
    //document.getElementById('LG').innerHTML += lg_arr;

    staffArray0 = window.localStorage.getItem("array_of_staff_names");
    staffArrayObj0 = window.localStorage.getItem("array_of_staff");
    let ms_string = window.localStorage.getItem('maleStaff');
    let ms_array = ms_string.split(',');

    let fs_string = window.localStorage.getItem('femStaff');
    let fs_array = fs_string.split(',');

    // loops through male staff array, creates new staff object for each, and adds it to staffArrayObj 
    for (let a = 0; a < ms_array.length; a++) {
        staffArrayObj.push(new StaffMember(ms_array[a], 0));
    }
    // loops through fem staff array, creates new staff object for each, and adds it to staffArrayObj 
    for (let b = 0; b < fs_array.length; b++) {
        staffArrayObj.push(new StaffMember(fs_array[b], 1));
    }

    // creates an array of strings from the string of comma separated names
    staffArray = staffArray0.split(',');

    document.getElementById("testMe").innerHTML += "Remember not to grab creamer if the power is out :)";
    document.getElementById("testMe").style.fontSize = "larger";
    document.getElementById("testMe").style.fontWeight = "900";
    /*
    for (let i = 0; i < staffArray.length; i++) {
        if (i == staffArray.length - 1) {
            document.getElementById("testMe").innerHTML += staffArrayObj[i].name;
        }
        else {
            document.getElementById("testMe").innerHTML += staffArrayObj[i].name + ", ";
        }
    }
    */

    // variables to determine number of rows and columns
    var rows = 35;
    var cols = 15;
    // sets the id of each cell of the table to a coordinate value: (a-z), (0-14)
    var myTable = document.getElementById('filthy');
    // sets the id of each cell to its corresponding coordinate
    for (let r = 0; r < rows; r++){
        var row = myTable.insertRow(-1);
        for (let c = 0; c < cols; c++){
            var cell = row.insertCell(-1);
            var coordinates = c + ", " + 'abcdefghijklmnopqrstuvwxyz123456789'.charAt(r);
            cell.setAttribute('id', coordinates);
            cell.setAttribute('class', 'cell');       
            // prints coordinates in each cell for testing
            //document.getElementById(coordinates).innerHTML = coordinates;
        }
    }
    // puts text in the "static" data cells
    var allCells = document.getElementsByClassName('cell');
    for (let i = 0; i < allCells.length; i++) {
        var curCell = allCells[i].id
        var str;
        switch (curCell) {
            case "1, e": case "1, f": case "1, g": case "1, h": case "1, i": case "1, j": case "1, k":
            case "1, l": case "1, m": case "1, r": case "1, t": case "1, u": case "1, v": case "1, w":
            case "1, x": case "1, y": case "1, z": case "1, 1": case "1, 2": case "1, 3": case "1, 4":
            case "1, 4": case "1, 5": case "1, 6": case "1, 7": case "1, 8": case "1, 9": case "8, 9":
            case "8, e": case "8, f": case "8, g": case "8, h": case "8, i": case "8, j": case "8, k":
            case "8, l": case "8, m": case "8, r": case "8, t": case "8, s": case "8, v": case "8, w":
            case "8, x": case "8, y": case "8, z": case "8, 1": case "8, 2": case "8, 3": case "8, 4":
            case "8, 5": case "8, 6": case "8, 7": case "8, 8": case "13, g": case "14, e": case "14, f":
            case "13, h": case "13, i": case "13, j": case "13, k": case "13, 4": case "13, 5": case "13, 6":
            case "13, 7": case "13, 8": case "13, 9": case "14, 4": case "14, 5": case "14, 6": case "14, 7":
            case "14, 8": case "14, 9": case "14, 3": case "14, 2": case "14, 1": case "14, z": case "14, y":
            case "14, x": case "14, w": case "14, g": case "14, h": case "14, i": case "14, j": case "14, k":
            case "14, l": case "14, m": case "14, r": case "14, s": case "14, t":
            case "13, w": case "13, x": case "13, y": case "13, z": case "13, 1": case "13, 2": case "13, 3":
                document.getElementById(curCell).style.backgroundColor = "grey";
                break;
            case "0, a":
                str = "FILTH";
                document.getElementById(curCell).innerHTML = str;
                break;
            case "0, b":
                str = "ROSTER";
                document.getElementById(curCell).innerHTML = str;
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
                document.getElementById(curCell).innerHTML = "TS";
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
            case "0, 4":
                document.getElementById(curCell).innerHTML = "Undutied";
                break;
            case "1, a":
                document.getElementById(curCell).innerHTML = "Sunday";
                break;
            /*
            case "0, d": case "0, j": case "0, k": case "0, m": case "0, o": case "0, p": case "0, w": 
            case "0, x": case "0, y": case "0, z": case "1, c": case "1, d": case "1, b": case "2, b": 
            case "3, b": case "4, b": case "5, b": case "6, b": case "7, b": case "8, b": case "9, b": 
            case "10, b": case "11, b": case "12, b": case "13, b": case "14, b": case "1, d": case "0, 1": 
            case "0, 2": case "2, d": case "3, d": case "4, d": case "5, d": case "6, d": case "7, d":
            case "8, d": case "9, d": case "0, 3": case "14, s": case "10, d": case "11, d": case "12, d": 
            case "13, d": case "14, d": case "8, c": case "13, c": case "14, c": case "0, c":
            case "1, e": case "1, f": case "1, g": case "1, h": case "1, i": case "1, j": case "1, k": 
            case "1, l": case "1, m": case "1, r": case "1, t": case "1, u": case "8, g": case "8, h": 
            case "8, i": case "8, j": case "8, k": case "13, g": case "13, h": case "13, i": case "13, j": 
            case "13, k": case "14, g": case "14, h": case "14, i": case "14, j": case "14, k": case "14, l":
            case "14, m": case "14, e": case "14, f": case "8, e": case "8, f": case "8, l": case "8, m":
            case "8, r": case "14, r": case "14, t": case "1, w": case "1, x": case "1, y": case "1, z":
            case "1, 1": case "1, 2": case "1, 3": case "2, w": case "2, x": case "2, y": case "2, z":
            case "2, 1": case "2, 2": case "2, 3": case "3, w": case "3, x": case "3, y": case "3, z":
            case "3, 1": case "3, 2": case "3, 3": case "4, w": case "4, y": case "4, z": case "4, 1": 
            case "4, 2": case "4, 3": case "5, w": case "5, y": case "5, z": case "5, 1": case "5, 2": 
            case "5, 3": case "6, w": case "6, y": case "6, z": case "6, 1": case "6, 2": case "6, 3":
            case "7, w": case "7, y": case "7, z": case "7, 1": case "7, 2": case "7, 3": case "8, w": 
            case "8, x": case "8, y": case "8, z": case "8, 1": case "8, 2": case "8, 3": case "9, w": 
            case "9, y": case "9, z": case "9, 1": case "9, 2": case "9, 3": case "10, w": case "10, y":
            case "10, z": case "10, 1": case "10, 2": case "10, 3": case "11, w": case "11, y": case "11, z": 
            case "11, 1": case "11, 2": case "11, 3": case "12, w": case "12, y": case "12, z": case "12, 1":
            case "12, 2": case "12, 3": case "13, w": case "13, x": case "13, y": case "13, z": case "13, 1": 
            case "13, 2": case "13, 3": case "12, x": case "11, x": case "4, x": case "5, x": case "6, x":
            case "7, x": case "8, x": case "9, x": case "10, x": case "14, w": case "14, x": case "14, y": 
            case "14, z": case "14, 1": case "14, 2": case "14, 3": case "8, q": case "2, e": case "3, e":
            case "4, e": case "5, e": case "6, e": case "7, e": case "9, e": case "10, e": case "11, e":
            case "12, e": case "13, e": case "2, f": case "3, f": case "4, f": case "5, f": case "6, f":
            case "7, f": case "9, f": case "10, f": case "11, f": case "2, r": case "3, r": case "4, r":
            case "5, r": case "6, r": case "7, r": case "9, r": case "10, r": case "11, r": case "12, r":
            case "13, r": case "2, s": case "3, s": case "4, s": case "5, s": case "6, s": case "7, s":
            case "9, s": case "10, s": case "11, s": case "12, s": case "13, s": case "8, s": case "8, t":
            case "12, f": case "13, f":
                document.getElementById(curCell).innerHTML = "";
                break;
            */
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

    // sets each staff members lifeguard boolean to 1 if their name was selected on the lifeguard multi-select form
    for (let n = 0; n < staffArrayObj.length; n++) {
        for (let t = 0; t < lg_arr.length; t++) {
            if (staffArrayObj[n].name == lg_arr[t]) {
                staffArrayObj[n].lifeguard = 1;
                // adds the lifeguard to the global lifeguard array
                staff_lg_array.push(staffArrayObj[n]);
            }
        }
    }

}


// creates a day object for each day in the session, and add the DOPs to each day based on form answers
function generate_DOPs() {
    
    let lifeguards_form = document.getElementById("lifeguardform");
    lifeguard_collection = lifeguards_form.selectedOptions;
    lifeguard_array = [];
    for (let i = 0; i < lifeguard_collection.length; i++) {
        lifeguard_array.push(lifeguard_collection[i].text);
    }
    window.localStorage.setItem('lifeguardStorage', lifeguard_array);

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
    for (let i = 0; i < inputElements_DOPs.length; i++) {         
        dayName = inputElements_DOPs[i].id;       
        collectionStringDOPs = inputElements_DOPs[i].selectedOptions;

        // adds a day with no DOPs if none were entered for that day
        if (collectionStringDOPs.length == 0) {
            dayArray.push(new Day([], dayName, i));
            continue;
        }

        //  loops through the selected names in each select element and puts them in an array
        for (let x = 0; x < collectionStringDOPs.length; x++) {
            // resets the array of strings
            if (x == 0) {
                arrayStringDOPs = []
            }
            arrayStringDOPs.push(collectionStringDOPs[x].text);
        }
        // loops through the array of names
        for (let k = 0; k < arrayStringDOPs.length; k++) {      
            // resets the array of Staff objects
            if (k == 0) {
                arrayStaffDOPs = []
            }           
            // loops through the the array of all Staff objects 
            for (let j = 0; j < staffArrayObj.length; j++) {                
                stringName = staffArrayObj[j].name;                
                // compares the current name in the array of selected names to each name in the array of all Staff
                if (arrayStringDOPs[k] == stringName) {                    
                    arrayStaffDOPs.push(staffArrayObj[j]);
                }
            }            
        }
        dayArray.push(new Day(arrayStaffDOPs, dayName, i));              
    }
    window.localStorage.setItem('dayStorage', JSON.stringify(dayArray));
}


// fills the days off at the bottom of the filth for each day
function display_DOPs() {
    dayArray2 = window.localStorage.getItem('dayStorage');
    dayArray2 = JSON.parse(dayArray2);
    
    // loops through each day and calls the fillDOP function on each
    for (let i = 0; i < dayArray2.length; i++) {
        //document.getElementById("days_off").innerHTML += dayArray2[i].dayID + ": ";
        fillDOP(dayArray2[i]);
        
        /*
        for (let k = 0; k < dayArray2[i].DOPs.length; k++) {
            document.getElementById("days_off").innerHTML += dayArray2[i].DOPs[k].name + ", ";
        }
        document.getElementById("days_off").innerHTML += "<br>";
        */
    }

}

// sets the lifeguard booleans of all staff members in each day's pull pool
function set_lifeguard_bools() {
    for (let i = 0; i < dayArray2.length; i++) {
        for (let x = 0; x < dayArray2[i].pull_pool.length; x++) {
            for (let n = 0; n < staff_lg_array.length; n++) {
                if (staff_lg_array[n].name == dayArray2[i].pull_pool[x].name) {
                    dayArray2[i].pull_pool[x].lifeguard = 1;
                }
            }
        }
    }
}


// function fill the DOP cells with the staff members off on the day given as a parameter
function fillDOP(myDay) {    
    
    // string that corresponds to the day's column in the table 
    let stringDayId = myDay.dayNumber + 1;
    //document.getElementById(stringDayId + ", v").innerHTML = "test";
    
    // leave cells blank if the day has no DOPs
    if (myDay.DOPs.length == 0) {
        //document.getElementById(stringDayId + ", v").innerHTML = "";
    }

    // loops through the DOPs for the day and adds them to the correct cell
    else {
        let x = 0;
        while (x < myDay.DOPs.length) {
            if (x == 0) {
                document.getElementById(stringDayId + ", v").innerHTML = myDay.DOPs[x].name;
            }
            else if (x == 1) {
                document.getElementById(stringDayId + ", w").innerHTML = myDay.DOPs[x].name;
            }
            else if (x == 2) {
                document.getElementById(stringDayId + ", x").innerHTML = myDay.DOPs[x].name;
            }
            else if (x == 3) {
                document.getElementById(stringDayId + ", y").innerHTML = myDay.DOPs[x].name;
            }
            else if (x == 4) {
                document.getElementById(stringDayId + ", z").innerHTML = myDay.DOPs[x].name;
            }
            else if (x == 5) {
                document.getElementById(stringDayId + ", 1").innerHTML = myDay.DOPs[x].name;
            }
            else if (x == 6) {
                document.getElementById(stringDayId + ", 2").innerHTML = myDay.DOPs[x].name;
            }
            else if (x == 7) {
                document.getElementById(stringDayId + ", 3").innerHTML = myDay.DOPs[x].name;
            }
            x++;
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

    window.localStorage.setItem("array_of_staff", allArrObj);
    window.localStorage.setItem("array_of_staff_names", allArr);

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


// stores the names input in name_entry.html in arrays
// only works on chrome as of 6/15/2022
function validate(frm) {
    let ele = frm.elements['feedName[]'];
    let eleList = [];

	for(let i = 0; i < ele.length; i++) {
        if (ele[i].value == '') {
            continue;
        }
        else {
            eleList.push(ele[i].value);
        }
    }

    let ele1 = frm.elements['feedName1[]'];
    let eleList1 = [];

	for(let j = 0; j < ele1.length; j++) {
        if (ele1[j].value == '') {
            continue;
        }
        else {
            eleList1.push(ele1[j].value);
        }
    }
    document.getElementById("results").innerHTML += eleList + "<br>" + eleList1;
    let maleArray = Array.from(eleList);
    let femArray = Array.from(eleList1);

    //let maleArray = maleArray0.filter(function (e) {return e != null;});
    //let femArray = femArray0.filter(function (e) {return e != null;});

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

// function to fill the kitchen duty for each day of the filth by calling fill_kitchen on each individual day
function fill_kitchens() {

    // sets the initial kitchen_pool
    kitchen_pool = staffArrayObj;

    // what do the following two lines do?
    let kitchen = new Duty("kitchen");
    let localStaffArray = staffArrayObj;

    
    // loops through each day of the session and calls fill_kitchen
    for (let i = 0; i < 14; i++) {
        
        try{
            fill_kitchen(dayArray2[i]);
        }
        catch(error) {
            console.log("error catch! " + dayArray2[i].dayID);
            recent_kitchens = [];
            fill_kitchen(dayArray2[i]);
        }
        
    }
    
}

// function to fill the kitchen duty with three staff members for the given date
function fill_kitchen(date) {

    // creates array of staff members to pull for kitchen from the pull_pool for the given date
    let lazies = [];
    let lazies_copy = [];
    for(let x = 0; x < date.pull_pool.length; x++) {
        lazies.push(date.pull_pool[x]);
        lazies_copy.push(date.pull_pool[x]);
    }
    let remove_indices = []
 

    // removes staff members from lazies if they have recently had kitchen using the recent_kitchens global variable
    if (recent_kitchens.length >= 1) {
        for (let q = 0; q < lazies.length; q++) {
            let name_check = lazies[q].name;
            for (let w = 0; w < recent_kitchens.length; w++) {  
                if (name_check == recent_kitchens[w].name) {             
                    // stores the index of the staff member to be removed from lazies
                    remove_indices.push(q);   
                }
            }
        }
    }
    // removes the staff members from lazies if their index is stored in remove_indices 
    if (remove_indices.length > 0) {
        for (let t = 0; t < remove_indices.length; t++) {
            for (let u = 0; u < lazies.length; u++) {
                if (u == remove_indices[t]) {
                    lazies.splice(u, 1, null);
                } 
            }
        }
    }

    let lazies0 = []
    // adds the remaining staff members to a new lazies array of viable kitchen staff
    for (let x = 0; x < lazies.length; x++) {
        if (lazies[x]) {
            lazies0.push(lazies[x]);
        }
    }

    // array of staff members who already have kitchen that day
    let workers = [];
    // randomly generated number to select a staff member from the lazies array
    let rand;

    
    // adds random staff member to workers
    rand = getRandomInt(0, lazies0.length - 1);
    workers.push(lazies0[rand]);
    recent_kitchens.push(lazies0[rand]);
    // removes the random staff member from lazies
    lazies0.splice(rand, 1)[0].name;

    // repeats above process
    rand = getRandomInt(0, lazies0.length - 1);
    workers.push(lazies0[rand]);
    recent_kitchens.push(lazies0[rand]);
    lazies0.splice(rand, 1)[0].name;

    // repeats above process
    rand = getRandomInt(0, lazies0.length - 1);
    workers.push(lazies0[rand]);
    recent_kitchens.push(lazies0[rand]);
    lazies0.splice(rand, 1)[0].name;
    
    // removes the kitchen workers from the general pull pool (not the lazies specific to kitchen viable staff)
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < lazies_copy.length; y++) {
            if (workers[x].name == lazies_copy[y].name) {
                lazies_copy.splice(y, 1);
            }
        }
    }


    // sets the pull pool for the date to the modified lazies array
    date.pull_pool = lazies_copy;
    // sets the given dates kit property to the array of staff members added to workers
    date.kit = workers;
    // string representing given day's dayNum, corrected for position on filth table
    let str_day_number = date.dayNumber + 1;

    document.getElementById("0, n").style.backgroundColor = "lightgrey";
    document.getElementById("0, o").style.backgroundColor = "lightgrey";
    document.getElementById("0, p").style.backgroundColor = "lightgrey";

    // adds the staff members assigned to kitchen for the given day to the filth table
    for (let i = 0; i < 3; i++) {
        if (i == 0) {
            document.getElementById(str_day_number + ", n").innerHTML = workers[i].name;
            document.getElementById(str_day_number + ", n").style.backgroundColor = "lightgrey";
        }
        else if (i == 1) {
            document.getElementById(str_day_number + ", o").innerHTML = workers[i].name;
            document.getElementById(str_day_number + ", o").style.backgroundColor = "lightgrey";
        }
        else if (i == 2) {
            document.getElementById(str_day_number + ", p").innerHTML = workers[i].name;
            document.getElementById(str_day_number + ", p").style.backgroundColor = "lightgrey";
        }
    }
}

// loops through each session day and calls fill_rec
function fill_recs() {
    
    for (let i = 0; i < 14; i++) {
        if (i == 0 || i == 7 || i == 12 || i == 13) {
            continue;
        }
        else {
            fill_rec(dayArray2[i]);
        }
    }


}

// function to fill the rec duty for a given session day
function fill_rec(date) {

    // creates array of staff members to pull for rec from the pull_pool for the given date
    let lazies = []
    for (let x = 0; x < date.pull_pool.length; x++) {
        lazies.push(date.pull_pool[x])
    }


    let rec_workers = [];

    // adds random staff member to rec_workers
    rand = getRandomInt(0, lazies.length - 1);
    rec_workers.push(lazies[rand]);
    // removes the random staff member from lazies
    lazies.splice(rand, 1)[0].name;

    // adds random staff member to rec_workers
    rand = getRandomInt(0, lazies.length - 1);
    rec_workers.push(lazies[rand]);
    // removes the random staff member from lazies
    lazies.splice(rand, 1)[0].name;

    // adds random staff member to rec_workers
    rand = getRandomInt(0, lazies.length - 1);
    rec_workers.push(lazies[rand]);
    // removes the random staff member from lazies
    lazies.splice(rand, 1)[0].name;

    // sets the pull pool for the date to the modified lazies array
    date.pull_pool = lazies;
    // sets the given dates kit property to the array of staff members added to workers
    date.rec = rec_workers;
    // string representing given day's dayNum, corrected for position on filth table
    let str_day_number = date.dayNumber + 1;

    document.getElementById("0, i").style.backgroundColor = "lightgrey";
    document.getElementById("0, j").style.backgroundColor = "lightgrey";
    document.getElementById("0, k").style.backgroundColor = "lightgrey";

    // adds the staff members assigned to kitchen for the given day to the filth table
    for (let x = 0; x < 3; x++) {
        if (x == 0) {
            document.getElementById(str_day_number + ", i").innerHTML = rec_workers[x].name;
            document.getElementById(str_day_number + ", i").style.backgroundColor = "lightgrey";
        }
        else if (x == 1) {
            document.getElementById(str_day_number + ", j").innerHTML = rec_workers[x].name;
            document.getElementById(str_day_number + ", j").style.backgroundColor = "lightgrey";
        }
        else if (x == 2) {
            document.getElementById(str_day_number + ", k").innerHTML = rec_workers[x].name;
            document.getElementById(str_day_number + ", k").style.backgroundColor = "lightgrey";
        }
    }


}

// loops through each session day and calls fill_lab on the given day
function fill_labs() {
    for (let i = 0; i < 14; i++) {
        if (i == 0 || i == 7 || i == 12 || i == 13) {
            continue;
        }
        else {
            try {
                fill_lab(dayArray2[i]);
            }
            catch (error) {
                console.log(dayArray2[i].dayID + " can't fill lab: everyone is dutied!");
                document.getElementById(i + 1 + ", g").innerHTML = "double up!";
                document.getElementById(str_day_number + ", g").style.backgroundColor = "lightgrey";
            }
        }
    }
}

// function to fill the lab duty for a given session day
function fill_lab(date) {
    // creates array of staff members to pull for lab from the pull_pool for the given date
    let lazies = []
    for (let x = 0; x < date.pull_pool.length; x++) {
        lazies.push(date.pull_pool[x])
    }

    // adds random staff member to rec_workers
    rand = getRandomInt(0, lazies.length - 1);
    lab_worker = lazies[rand];
    // removes the random staff member from lazies
    lazies.splice(rand, 1)[0].name;

    // sets the pull pool for the date to the modified lazies array
    //date.pull_pool = lazies;
    date.pull_pool = [];
    for (let x = 0; x < lazies.length; x++) {
        date.pull_pool.push(lazies[x]);
    }

    // sets the given dates kit property to the array of staff members added to workers
    date.lab = lab_worker;
    // string representing given day's dayNum, corrected for position on filth table
    let str_day_number = date.dayNumber + 1;

    document.getElementById("0, g").style.backgroundColor = "lightgrey";

    // fills in the lab duty on the table for the given date
    document.getElementById(str_day_number + ", g").innerHTML = lab_worker.name;
    document.getElementById(str_day_number + ", g").style.backgroundColor = "lightgrey";
}

// loops through each session day and calls fill_lib on the given day
function fill_libs() {
    for (let i = 0; i < 14; i++) {
        if (i == 0 || i == 7 || i == 12 || i == 13) {
            continue;
        }
        else {
            try {
                fill_lib(dayArray2[i]);
            }
            catch (error) {
                console.log(dayArray2[i].dayID + " can't fill library: everyone is dutied!");
                document.getElementById(i + 1 + ", h").innerHTML = "double up!";
            }
        }
    }
}

// function to fill the library duty for a given session day
function fill_lib(date) {
    // creates array of staff members to pull for library from the pull_pool for the given date
    let lazies = []
    for (let x = 0; x < date.pull_pool.length; x++) {
        lazies.push(date.pull_pool[x])
    }


    // adds random staff member to rec_workers
    rand = getRandomInt(0, lazies.length - 1);
    lib_worker = lazies[rand];
    // removes the random staff member from lazies
    lazies.splice(rand, 1)[0].name;

    // sets the pull pool for the date to the modified lazies array
    date.pull_pool = lazies;
    // sets the given dates kit property to the array of staff members assigned to library
    date.lib = lib_worker;
    // string representing given day's dayNum, corrected for position on filth table
    let str_day_number = date.dayNumber + 1;

    // fills in the library duty on the table for the given date
    document.getElementById(str_day_number + ", h").innerHTML = lib_worker.name;
}

// loops through each session day and calls fill_tablesetter on the each day
function fill_tablesetters() {
    for (let i = 0; i < 13; i++) {
        if (i == 7) {
            continue;
        }
        else {
            try {
                fill_tablesetter(dayArray2[i]);
            }
            catch (error) {
                console.log(dayArray2[i].dayID + " can't fill tablesetters: everyone is dutied!");
                document.getElementById(i + 1 + ", q").innerHTML = "double up!";
            }
        }
    }
}

// function to fill the tablesetters duty for a given session day
function fill_tablesetter(date) {
    // creates array of staff members to pull from the pull_pool for the given date
    let lazies = []
    for (let x = 0; x < date.pull_pool.length; x++) {
        lazies.push(date.pull_pool[x])
    }

    // adds random staff member to rec_workers
    rand = getRandomInt(0, lazies.length - 1);
    ts_worker = lazies[rand];
    // removes the random staff member from lazies
    lazies.splice(rand, 1)[0].name;

    // sets the pull pool for the date to the modified lazies array
    date.pull_pool = lazies;
    // sets the given dates ts property to staff members assigned to tablesetters
    date.ts = ts_worker;
    // string representing given day's dayNum, corrected for position on filth table
    let str_day_number = date.dayNumber + 1;

    // fills in the lab duty on the table for the given date
    document.getElementById(str_day_number + ", q").innerHTML = ts_worker.name;
}

// loops through each session day and calls fill_rangerG on the each day
function fill_rangerGs() {
    for (let i = 1; i < 13; i++) {
        if (i==7) {
            continue;
        }
        else {
            try {
                fill_rangerG(dayArray2[i]);
            }
            catch (error) {
                console.log(dayArray2[i].dayID + " can't fill ranger G: everyone is dutied!");
                document.getElementById(i + 1 + ", t").innerHTML = "double up!";
            }
        }
    }
}

// function to fill the ranger G duty for a given session day
function fill_rangerG(date) {
    // creates array of staff members to pull from the pull_pool for the given date
    let lazies = []
    for (let x = 0; x < date.pull_pool.length; x++) {
        lazies.push(date.pull_pool[x])
    }

    // adds random staff member to rec_workers
    rand = getRandomInt(0, lazies.length - 1);
    rg_worker = lazies[rand];
    // removes the random staff member from lazies
    lazies.splice(rand, 1)[0].name;

    // sets the pull pool for the date to the modified lazies array
    date.pull_pool = lazies;
    // sets the given dates ts property to staff members assigned to tablesetters
    date.rg = rg_worker;
    // string representing given day's dayNum, corrected for position on filth table
    let str_day_number = date.dayNumber + 1;

    // fills in the lab duty on the table for the given date
    document.getElementById(str_day_number + ", t").innerHTML = rg_worker.name;
}

// loops through each session day and calls fill_rangerB() on the each day
function fill_rangerBs() {
    for (let i = 1; i < 14; i++) {
        try {
            fill_rangerB(dayArray2[i]);
        }
        catch (error) {
            console.log(dayArray2[i].dayID + " can't fill ranger B: everyone is dutied!");
            document.getElementById(i + 1 + ", u").innerHTML = "double up!";
            document.getElementById(i + 1 + ", u").style.backgroundColor = "lightgrey";
        }
    }
}

// function to fill the ranger B duty for a given session day
function fill_rangerB(date) {
    // creates array of staff members to pull from the pull_pool for the given date
    let lazies = []
    for (let x = 0; x < date.pull_pool.length; x++) {
        lazies.push(date.pull_pool[x])
    }

    // assigns random staff member to rb_worker
    rand = getRandomInt(0, lazies.length - 1);
    rb_worker = lazies[rand];
    // removes the random staff member from lazies
    lazies.splice(rand, 1)[0].name;

    // sets the pull pool for the date to the modified lazies array
    date.pull_pool = lazies;
    // sets the given dates ts property to staff members assigned to tablesetters
    date.rb = rb_worker;
    // string representing given day's dayNum, corrected for position on filth table
    let str_day_number = date.dayNumber + 1;

    document.getElementById("0, u").style.backgroundColor = "lightgrey";

    // fills in the lab duty on the table for the given date
    document.getElementById(str_day_number + ", u").innerHTML = rb_worker.name;
    document.getElementById(str_day_number + ", u").style.backgroundColor = "lightgrey";
}

// loops through each session day an calls fill_pool() on each day
function fill_pools() {
    
    for (let i = 1; i < 13; i++) {
        if (i == 7) {
            continue;
        }
        else {
            fill_pool(dayArray2[i]);
        }
    }

}

// fills the pool duty for the given date
function fill_pool(date) {

    // creates array of staff members to pull for pool from the pull_pool for the given date
    let lazies = []
    for (let x = 0; x < date.pull_pool.length; x++) {
        lazies.push(date.pull_pool[x])
    }
    // non-lifeguard pull pool
    const non_lifeguard_lazies = [];
    // lifeguard pull pool
    const lifeguard_lazies = [];
    

    // adds lifeguards to lifeguard_lazies, adds non lifeguards to non_lifeguard_lazies (by looking at lifeguard booleans)
    for (let n = 0; n < lazies.length; n++) {
        if (lazies[n].lifeguard == 1) {
            lifeguard_lazies.push(lazies[n])
        }
        else if (lazies[n].lifeguard == 0) {
            non_lifeguard_lazies.push(lazies[n]);
        }
    }
    


    pool_workers = [];
    
    no_lg = 0;

    // adds on LG and one non-LG to pool, if there are any available LGs
    if (lifeguard_lazies.length > 0) {   
        
        // adds random staff member from the lifeguard pull pool to pool_workers
        rand = getRandomInt(0, lifeguard_lazies.length - 1);
        pool_workers.push(lifeguard_lazies[rand]);
        // removes the random staff member from lifeguard_lazies
        lifeguard_lazies.splice(rand, 1)[0].name;

        // adds random non-lifeguard to pool_workers
        rand = getRandomInt(0, non_lifeguard_lazies.length - 1);
        pool_workers.push(non_lifeguard_lazies[rand]);
        // removes the random staff member from non_lifeguard_lazies
        non_lifeguard_lazies.splice(rand, 1)[0].name;
    }
    // adds two non_LGs to pool, if there are no available LGs
    else {

        no_lg = 1;
        // adds random non-lifeguard to pool_workers
        rand = getRandomInt(0, non_lifeguard_lazies.length - 1);
        pool_workers.push(non_lifeguard_lazies[rand]);
        // removes the random staff member from non_lifeguard_lazies
        non_lifeguard_lazies.splice(rand, 1)[0].name;

        // adds random non-lifeguard to pool_workers
        rand = getRandomInt(0, non_lifeguard_lazies.length - 1);
        pool_workers.push(non_lifeguard_lazies[rand]);
        // removes the random staff member from non_lifeguard_lazies
        non_lifeguard_lazies.splice(rand, 1)[0].name;
    }
    

    // combines the unassigned lifeguard and non-lifeguard pull pools to recreate the general pull pool
    for (let i = 0; i < lifeguard_lazies.length; i++) {
        non_lifeguard_lazies.push(lifeguard_lazies[i]);
    }

    // sets the pull pool for the date to the modified lazies array
    date.pull_pool = non_lifeguard_lazies;
    // sets the given dates pool property to staff members assigned to tablesetters
    date.pool = pool_workers;
    // string representing given day's dayNum, corrected for position on filth table
    let str_day_number = date.dayNumber + 1;
    
    if (no_lg == 0) {
        // adds the staff members assigned to kitchen for the given day to the filth table
        for (let i = 0; i < 2; i++) {
            if (i == 0) {
                document.getElementById(str_day_number + ", l").innerHTML = pool_workers[i].name;
            }
            else if (i == 1) {
                document.getElementById(str_day_number + ", m").innerHTML = pool_workers[i].name;
            }
        }
    }

    // signifies with XX if there are no lifeguards on pool that day
    else { 
        // adds the staff members assigned to kitchen for the given day to the filth table
        for (let i = 0; i < 2; i++) {
            if (i == 0) {
                document.getElementById(str_day_number + ", l").innerHTML = pool_workers[i].name + "&nbsp &nbsp &nbsp" + "XX";
            }
            else if (i == 1) {
                document.getElementById(str_day_number + ", m").innerHTML = pool_workers[i].name + "&nbsp &nbsp &nbsp" + "XX";
            }
        }

    }
    
    
}

// fills out who is undutied for each session day
function fill_unassigned() {
    for (let i = 1; i < 12; i++) {
        if (i == 7) {
            continue;
        }
        else {
            fill_unassigneds(dayArray2[i]);
        }
    }
}

// fills out who is undutied for the given date
function fill_unassigneds(date) {

    // string representing given day's dayNum, corrected for position on filth table
    let stringDayId = date.dayNumber + 1;

    let len = date.pull_pool.length;

    document.getElementById("0, 4").style.backgroundColor = "lightgrey";
    for (let n = 4; n < 10; n++) {
        document.getElementById(stringDayId + ", " + n).style.backgroundColor = "lightgrey";
    }

    // leave cells blank if the day has no undutied staff members
    if (len == 0) {
        //document.getElementById(stringDayId + ", v").innerHTML = "";
    }

    // loops through the undutied staff members for the day and adds them to the correct cell
    else {
        let x = 0;
        while (x < len) {
            if (x == 0) {
                document.getElementById(stringDayId + ", 4").innerHTML = date.pull_pool[x].name;
            }
            else if (x == 1) {
                document.getElementById(stringDayId + ", 5").innerHTML = date.pull_pool[x].name;
            }
            else if (x == 2) {
                document.getElementById(stringDayId + ", 6").innerHTML = date.pull_pool[x].name;
            }
            else if (x == 3) {
                document.getElementById(stringDayId + ", 7").innerHTML = date.pull_pool[x].name;
            }
            else if (x == 4) {
                document.getElementById(stringDayId + ", 8").innerHTML = date.pull_pool[x].name;
            }
            else if (x == 5) {
                document.getElementById(stringDayId + ", 9").innerHTML = date.pull_pool[x].name;
            }
            x++;
        }
    }
}
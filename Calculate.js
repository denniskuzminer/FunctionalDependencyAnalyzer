/**
 * Calculates Attribute Closures, Prime Attributes, Canonical Cover, 
 * Highest Normalized Form, 3NF Decomposition, and Methodology
 * @author Dennis Kuzminer
 */

let full = '';
let value = '';
let unformattedInput;
let display;
var combi = [];
var determinedBy = [];
var closuresStr = "";
let index = '';
var strCombs = [];
let primes = '';
let notPrimes = '';
let primesOutput = '';
var canonicalCover;
let finalDecomposedCanonicalCover;
let final3NF;
let finalCanonicalCover;
let finalBCNF;
let highestNormalForm = '<br/>Highest Normalized Form (1NF, 2NF, 3NF): <br/>';
let is1NF = false; 
let is2NF = false; 
let is3NF = false; 


class Calculate {
    constructor(full, value) {
        this.full = full;
        this.value = value;
        document.getElementById("val").innerHTML = "Your input is: " + value;
        full = full.toUpperCase();
        value = value.toUpperCase();
        value = value.split(" ").join("");
        full = full.split(" ").join("");
        full = sortString(full);
        parseInput(full, value);
        document.getElementById("val2").innerHTML = "Your parsed input is: " + display + "<br>Your relation consists of: " + full;
        combi = substrings(full);
        determinedBy = findAttributeClosure(full, unformattedInput);
        displayClosure(full);
        document.getElementById("val3").innerHTML = closuresStr;
        displayPrimes(full);
        document.getElementById("val4").innerHTML = primesOutput;
        calculateCanonicalCover(full, unformattedInput);
        document.getElementById("val5").innerHTML = canonicalCover;
        calculateHighestNormalForm(full, unformattedInput);
        document.getElementById("val6").innerHTML = highestNormalForm;
        if(!is3NF) {
            thirdNormalForm(full, unformattedInput);
            document.getElementById("val7").innerHTML = final3NF;
        } else {
            document.getElementById("val7").innerHTML = '<br/>As this relation is already in Third Normal Form, there is no need to decompose it.';
        }
        // BCNF(full, unformattedInput);
        // document.getElementById("val7").innerHTML = finalBCNF;
    }
}

// This should handle all of the parsing
const parseInput = (full, value) => {
    value = value.toUpperCase();
    unformattedInput = value.split(";");
    for(var i = 0; i < unformattedInput.length; i++) {
        unformattedInput[i] = unformattedInput[i].split("->");
    }
    display = "";
    for(var i = 0; i < unformattedInput.length; i++) {
        unformattedInput[i][0] = sortString(unformattedInput[i][0]);
        unformattedInput[i][1] = sortString(unformattedInput[i][1]);
        display += `<br/>${unformattedInput[i][0]} -> ${unformattedInput[i][1]}`;
    }
}

//Creates combinations of substrings
function substrings(str1)
{
    var finalArr = [];
    var array1 = [];
    for (var x = 0, y=1; x < str1.length; x++,y++) 
    {
        array1[x]=str1.substring(x, y);
    }
    var temp= "";
    var slent = Math.pow(2, array1.length);

    for (var i = 0; i < slent ; i++)
    {
        temp= "";
        for (var j=0;j<array1.length;j++) {
            if ((i & Math.pow(2,j))){ 
                temp += array1[j];
            }
        }
        if (temp !== "")
        {
            finalArr.push(temp);
        }
    }
    finalArr = finalArr.sort(function(a, b) {
        return a.length - b.length || // sort by length, if equal then
               a.localeCompare(b);    // sort by dictionary order
    });
    return finalArr;
}

//Display all of the closures for each attribute
const findAttributeClosure = (full, unformattedInput) => {
    var combinations = substrings(full);
    var determinedByTemp = [];
    // Reflexivity
    for(var i = 0; i < combinations.length; i++) {
        determinedByTemp.push(combinations[i]);
    }
    // This appends the given RHS's
    for(var i = 0; i < unformattedInput.length; i++) {
        index = combinations.indexOf(unformattedInput[i][0]);
        determinedByTemp[index] += unformattedInput[i][1];
        determinedByTemp[index] = removeDuplicateCharacters(determinedByTemp[index]);
        determinedByTemp[index] = sortString(determinedByTemp[index]);
    }
    // First layer of transitivity
    for(var i= 0; i < unformattedInput.length; i++) {
        for(var j= 0; j < unformattedInput.length; j++) {
            if(includesInAnyOrder(unformattedInput[i][0], unformattedInput[j][1])) {
                index = combinations.indexOf(unformattedInput[j][0]);
                determinedByTemp[index] += unformattedInput[i][1];
                determinedByTemp[index] = removeDuplicateCharacters(determinedByTemp[index]);
                determinedByTemp[index] = sortString(determinedByTemp[index]);
            }
        }
    }
    // The remaining transitivities
    for(var i= 0; i < combinations.length; i++) {
        for(var j= 0; j < combinations.length; j++) {
            if(includesInAnyOrder(combinations[i], determinedByTemp[j])) {
                determinedByTemp[j] += determinedByTemp[i];
                determinedByTemp[j] = removeDuplicateCharacters(determinedByTemp[j]);
                determinedByTemp[j] = sortString(determinedByTemp[j]);
            }
        }
    }
    // Check that all single letter attribute closures are present in the closures of attribute sets that have more than one attribute 
    for(var i = 0; i < combinations.length; i++) {
        if(combinations[i].length > 1) {
            for(var j = 0; j < combinations[i].length; j++) {
                let tempChar = combinations[i].charAt(j);
                for(var k = 0; k < combinations.length; k++) {
                    if(combinations[k] === tempChar) {
                        index = k;
                    }
                } 
                determinedByTemp[i] += determinedByTemp[index];
            }
            determinedByTemp[i] = removeDuplicateCharacters(determinedByTemp[i]);
            determinedByTemp[i] = sortString(determinedByTemp[i]);
        }
    }
    return determinedByTemp;
}

// Finds primes and displays closure
let primeAttributes = '';
let lengths = [];
let candidateKeys = [];
const displayClosure = (full) => {
    for(var i = 0; i < this.combi.length; i++) {
        if(this.determinedBy[i] === full) {
            lengths.push(this.combi[i].length);
        }  
    }
    for(var i = 0; i < this.combi.length; i++) {
        this.closuresStr += `<br/>(${this.combi[i]})﹢ -> ${this.determinedBy[i]}`; 
        if(this.determinedBy[i] === full) {
            if(this.combi[i].length == lengths[0]) {
                primeAttributes += this.combi[i].toString(); 
                candidateKeys.push(this.combi[i]);
                this.closuresStr += ` --> Candidate Key`;
            } else {
                this.closuresStr += ` --> Superkey`;
            }
        }   
    }
}

// Display the primes
const displayPrimes = (full) => {
    let tempFull = full;
    primeAttributes = removeDuplicateCharacters(primeAttributes);
    primeAttributes = sortString(primeAttributes);
    for(var i = 0; i < primeAttributes.length; i++) {
        if(full.indexOf(primeAttributes.charAt(i)) != -1) {
            tempFull = tempFull.replace(primeAttributes.charAt(i), '');
            notPrimes = tempFull;
        }
    }
    primeAttributes = primeAttributes.split('').join(', ');
    notPrimes = removeDuplicateCharacters(notPrimes);
    notPrimes = sortString(notPrimes);
    notPrimes = notPrimes.split('').join(', ');
    primesOutput += `<br/>All prime attributes: ${primeAttributes}`;
    primesOutput += `<br/>All non-prime attributes: ${notPrimes}`;
}

// Finds canonical cover
const calculateCanonicalCover = (full, unformattedInput) => {
    //Finds totLength of all RHS's
    let totLength = 0;
    for(var i = 0; i < unformattedInput.length; i++) {
        totLength += unformattedInput[i][1].length;
    }
    let tempCanonicalCover = new Array(totLength).fill(0).map(() => new Array(2).fill(''));

    // Step 1: Splits all the RHS's 
    var count = 0;
    var unformattedCount = 0;
    while(true) {
        if(unformattedInput[unformattedCount][1].length == 1) {  
            tempCanonicalCover[count][0] = unformattedInput[unformattedCount][0];
            tempCanonicalCover[count][1] = unformattedInput[unformattedCount][1];
            count+=unformattedInput[unformattedCount][1].length;
        } else {
            for(var j = 0; j < unformattedInput[unformattedCount][1].length; j++) {
                tempCanonicalCover[count+j][0] = unformattedInput[unformattedCount][0];
                tempCanonicalCover[count+j][1] = unformattedInput[unformattedCount][1].charAt(j);
            }
            count = count + unformattedInput[unformattedCount][1].length;
        }
        unformattedCount++;
        if(count >= totLength) {
            break;
        }
    }
    let smallerLHS = '';

    //Step 2: Find extraneous attributes on LHS in each tempCanonicalCover and remove duplicates
    for(var i = 0; i < tempCanonicalCover.length; i++) {
        var doesInclude = false;
        for(var j = 0; j < tempCanonicalCover[i][0].length; j++) {
            if(tempCanonicalCover[i][0].length > 1) {
                smallerLHS = removeCharacter(tempCanonicalCover[i][0], j);
                smallerLHS = sortString(smallerLHS);
                if(includesInAnyOrder(tempCanonicalCover[i][1], determinedBy[combi.indexOf(smallerLHS)])) {
                    doesInclude = true;
                }
            }
            if(doesInclude) {
                tempCanonicalCover[i][0] = smallerLHS;
            }
        }
        
    }
    tempCanonicalCover = tempCanonicalCover.map(JSON.stringify).reverse().filter(function (e, i, a) {
        return a.indexOf(e, i+1) === -1;
    }).reverse().map(JSON.parse);
    
    //Step 3: Create attribute closures for the new set of decomposed attributes created by Step 2 
    // Then remove one of the FDs. If the closures of new LHS's are the same without the removed, then remove the FD entirely
    let removedFDs = [];
    var tempClosures = [];
    let removedCanonicalCover = new Array(tempCanonicalCover.length-1).fill(0).map(() => new Array(2).fill(''));
    for(var m = 0; m < tempCanonicalCover.length; m++) {
        if(includesInAnyOrder(tempCanonicalCover[m][1], tempCanonicalCover[m][0])) {
            removedFDs.push(m);
        } else {
            //Deletes an FD
            removedCanonicalCover = removeFD(tempCanonicalCover, m);
            tempClosures = findAttributeClosure(full, removedCanonicalCover);
            if(JSON.stringify(tempClosures) == JSON.stringify(this.determinedBy)) {
                removedFDs.push(m);
            }
        }
    }
    let numOfFDs = tempCanonicalCover.length - removedFDs.length;
    
    finalDecomposedCanonicalCover = new Array(numOfFDs).fill(0).map(() => new Array(2).fill(''));
    let w = 0
    for(var i = 0; i < tempCanonicalCover.length; i++) {
        if(!(removedFDs.includes(i))) {
            finalDecomposedCanonicalCover[w][0] = tempCanonicalCover[i][0];
            finalDecomposedCanonicalCover[w][1] = tempCanonicalCover[i][1];
            w++;
        }
    }

    // Step 4: Combine the RHS's of any FDs with the same LHS
    let uniqueElems = [];
    for(var i = 0; i < finalDecomposedCanonicalCover.length; i++) {
        uniqueElems.push(finalDecomposedCanonicalCover[i][0]);
    }
    uniqueElems = uniqueElems.filter(distinct);
    for(var i = 0; i < finalDecomposedCanonicalCover.length; i++) {
        for(var j = 0; j < finalDecomposedCanonicalCover.length; j++) {
            if(finalDecomposedCanonicalCover[i][0] == finalDecomposedCanonicalCover[j][0]) {
                finalDecomposedCanonicalCover[i][1] += finalDecomposedCanonicalCover[j][1];
                finalDecomposedCanonicalCover[i][1] = removeDuplicateCharacters(finalDecomposedCanonicalCover[i][1]);
                finalDecomposedCanonicalCover[i][1] = sortString(finalDecomposedCanonicalCover[i][1]);
            }
        }
    }
    finalDecomposedCanonicalCover = finalDecomposedCanonicalCover.map(JSON.stringify).reverse().filter(function (e, i, a) {
        return a.indexOf(e, i+1) === -1;
    }).reverse().map(JSON.parse);

    // Print Fmin
    canonicalCover = `<br/>The canonical or minimum spanning cover for this relation is: `
    for(var i = 0; i < finalDecomposedCanonicalCover.length; i++) {   
        canonicalCover += `<br/>${finalDecomposedCanonicalCover[i][0]} -> ${finalDecomposedCanonicalCover[i][1]}`; 
    }
}
let threeNF = [];
const thirdNormalForm = (full, unformattedInput) => {
    // Use canonical cover to calculate tables
    for(var i = 0; i < finalDecomposedCanonicalCover.length; i++) {
        threeNF.push(`${finalDecomposedCanonicalCover[i][0]}${finalDecomposedCanonicalCover[i][1]}`);
    }
    // Check if there is a superkey
    let hasSuperkey = false;
    for(var i = 0; i < threeNF.length; i++) {
        index = combi.indexOf(threeNF[i]);
        if(determinedBy[index] == full) {
            hasSuperkey = true;
            break;
        }
    }  
    
    let firstKey = '';
    for(var i = 0; i < combi.length; i++) {
        if(determinedBy[i] == full) {
            firstKey = combi[i];
            break;
        }
    }
    if(!hasSuperkey) {
        threeNF.push(firstKey);
    }
    for(var i = 0; i < threeNF.length; i++) {
        for(var j = 0; j < threeNF.length; j++) {
            if(includesInAnyOrder(threeNF[j], threeNF[i]) && i != j) {
                threeNF[j] = '';
            }
        }
    }
    
    final3NF = `<br/>The third normal form decomposition using canonical cover is: `;
    for(var i = 0; i < threeNF.length; i++) {   
        if(threeNF[i] != '') {
            final3NF += `<br/>R${i+1} = ${threeNF[i]}`;
        }
    }
}

// Shows greatest NF 
const calculateHighestNormalForm = (full, unformattedInput) => {
    is1NF = findIs1NF(full, unformattedInput);
    is2NF = findIs2NF(full, unformattedInput);
    is3NF = findIs3NF(full, unformattedInput);
}

const findIs1NF = (full, unformattedInput) => {
    highestNormalForm += 'The relation is assumed to be in First Normal Form. <br/>';
    return true; 
}

const findIs2NF = (full, unformattedInput) => {
    let tempNotPrimes = notPrimes.split(', ').join('');
    if(is1NF) {
        if(candidateKeys[0].length == 1) {
            highestNormalForm += 'The relation is in Second Normal Form.<br/>';
            return true;
        } else {
            for(var i = 0; i < candidateKeys.length; i++) {
                let tempProperSubsets = substrings(candidateKeys[i]);
                tempProperSubsets.pop();
                for(var j = 0; j < tempProperSubsets.length; j++) {
                    for(var k = 0; k < tempNotPrimes.length; k++) {
                        if(determinedBy[combi.indexOf(tempProperSubsets[j])].includes(tempNotPrimes.charAt(k))) {
                            highestNormalForm += 'The relation is not in Second Normal Form.<br/>';
                            return false;
                        }
                    }
                }
            }
        }
    } 
    highestNormalForm += `The relation is in Second Normal Form.<br/>`;
    return true;
}

const findIs3NF = (full, unformattedInput) => {
    let isthreeNF = true;
    let tempPrimes = primeAttributes.split(', ').join('');
    if(is2NF) {
        for(var i = 0; i < unformattedInput.length; i++) {
            isthreeNF = isthreeNF && (determinedBy[combi.indexOf(unformattedInput[i][0])] == full || includesInAnyOrder(unformattedInput[i][1], tempPrimes));
        }
    } else {
        highestNormalForm += 'The relation is not in Third Normal Form.<br/>';
        return false;
    }
    if(isthreeNF) {
        highestNormalForm += 'The relation is in Third Normal Form.<br/>';
    } else {
        highestNormalForm += 'The relation is not in Third Normal Form.<br/>';
    }
    return isthreeNF;
}



// Helper functions
function removeDuplicateCharacters(string) {
    return string
      .split('')
      .filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      })
      .join('');
}

// const violatesBCNF = (full, LHS) => {
//     if(includesInAnyOrder(full, determinedBy[combi.indexOf(LHS)])) {
//         return false;
//     }
//     return true;
// }

function removeItemOnce(arr, value) {
    var ind = arr.indexOf(value);
    if (ind > -1) {
      arr.splice(ind, 1);
    }
    return arr;
}

const removeFD = (canonicalCovers, i) => {
    let newArr = new Array(canonicalCovers.length-1).fill(0).map(() => new Array(2).fill(''));
    for(var j = 0; j < canonicalCovers.length; j++) {
        if(j < i) {
            newArr[j][0] = canonicalCovers[j][0];
            newArr[j][1] = canonicalCovers[j][1];
        }
        if(j > i) {
            newArr[j-1][0] = canonicalCovers[j][0];
            newArr[j-1][1] = canonicalCovers[j][1];
        }
    }
    return newArr;
}

function deleteRow(arr, row) {
    arr = arr.slice(0); // make copy
    arr.splice(row - 1, 1);
    return arr;
}

const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
}

const sortString = (text) => {
    return text.split('').sort().join('');
}

function removeCharacter(str, char_pos) 
{
    part1 = str.substring(0, char_pos);
    part2 = str.substring(char_pos + 1, str.length);
    return (part1 + part2);
}

//str2.includes(str1)
const includesInAnyOrder = (str1 ,str2) => {

    let contains = true;
    for(var i = 0; i < str1.length; i++) {
        if(str2.indexOf(str1.charAt(i)) != -1) {
            contains = true;
        } else {
            return false;
        }
    }
    return true;
}
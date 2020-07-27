
let full = '';
let value = '';
let unformattedInput;
let display;
var combi = [];
var determinedBy = [];
let combined = '';
//var closuresArr = [];
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


class Calculate {
    constructor(full, value) {
        this.full = full;
        this.value = value;
        document.getElementById("val").innerHTML = "Your input is: " + value;
        validateInput(full, value);
        full = full.toUpperCase();
        value = value.toUpperCase();
        document.getElementById("val2").innerHTML = "Your parsed input is: " + display + "<br>Your relation consists of: " + full;
        substrings(full);
        calculate(full, unformattedInput);
        document.getElementById("val3").innerHTML = closuresStr;
        findPrimes(full, unformattedInput);
        document.getElementById("val4").innerHTML = primesOutput;
        calculateCanonicalCover(full, unformattedInput);
        document.getElementById("val5").innerHTML = canonicalCover;
        thirdNormalForm(full, unformattedInput);
        document.getElementById("val6").innerHTML = final3NF;
        // BCNF(full, unformattedInput);
        // document.getElementById("val7").innerHTML = finalBCNF;
    }
}


//This should check if the input is in the correct format

const validateInput = (full, value) => {



    parseInput(full, value);
}

// This should handle all of the parsing
const parseInput = (full, value) => {
    value = value.toUpperCase();
    unformattedInput = value.split(";");
    for(var i = 0; i < unformattedInput.length; i++) {
        unformattedInput[i] = unformattedInput[i].split("->");
    }
    // This will create an array of length 2 arrays containing the dependencies

    //This will display our wonderful input
    display = "";
    for(var i = 0; i < unformattedInput.length; i++) {
        unformattedInput[i][0] = sortString(unformattedInput[i][0]);
        unformattedInput[i][1] = sortString(unformattedInput[i][1]);
        display += `<br/>${unformattedInput[i][0]} -> ${unformattedInput[i][1]}`;
    }
}

const calculate = (full, unformattedInput) => {
    findAttributeClosure(full, unformattedInput);
}

function substrings(str1)
{
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
            combi.push(temp);
        }
    }
    combi = combi.sort(function(a, b) {
        return a.length - b.length || // sort by length, if equal then
               a.localeCompare(b);    // sort by dictionary order
    });
    for(var i = 0; i < combi.length; i++) {
        combined += `<br/>${combi[i]}`;
    }
    //console.log(combi.join("\n"));
}

//Display all of the relations for each attribute
const findAttributeClosure = (full, unformattedInput) => {
    
    for(var i = 0; i < combi.length; i++) {
        determinedBy.push(combi[i]);
    }

    // This finds all of the single letter closures
    for(var i = 0; i < unformattedInput.length; i++) {
        index = combi.indexOf(unformattedInput[i][0]);
        determinedBy[index] += unformattedInput[i][1];
        
        determinedBy[index] = removeDuplicateCharacters(determinedBy[index]);
        determinedBy[index] = sortString(determinedBy[index]);


        //document.getElementById("val3").innerHTML = 'hi';
        //document.getElementById("val3").innerHTML = 'hi';
        //determinedBy[i].sort();
        
    }

/*      
    Also make a loop that adds to the one below that cahnges the if statement to 
    check for any possible combination of unformattedInput[i][0]
*/


    for(var i= 0; i < unformattedInput.length; i++) {
        for(var j= 0; j < unformattedInput.length; j++) {
            if(includesInAnyOrder(unformattedInput[i][0], unformattedInput[j][1])) {
            //if(unformattedInput[j][1].includes(unformattedInput[i][0])) {
            
            
            //if(unformattedInput[i][0] === unformattedInput[j][1]) {
                index = combi.indexOf(unformattedInput[j][0]);
                determinedBy[index] += unformattedInput[i][1];
                determinedBy[index] = removeDuplicateCharacters(determinedBy[index]);
                determinedBy[index] = sortString(determinedBy[index]);
                //append unformattedInput[i][1] to the closure of fdjs lhs
            }
            // if(lhs of fdi === rhs of fdj) {
            //     append rhs of fdi to the closure of fdjs lhs
            // }
        }
    }

    for(var i= 0; i < combi.length; i++) {
        for(var j= 0; j < combi.length; j++) {
            if(includesInAnyOrder(combi[i], determinedBy[j])) {
            //if(unformattedInput[i][0] === unformattedInput[j][1]) {
                // index = combi.indexOf(combi[j]);
                determinedBy[j] += determinedBy[i];
                determinedBy[j] = removeDuplicateCharacters(determinedBy[j]);
                determinedBy[j] = sortString(determinedBy[j]);
                //append unformattedInput[i][1] to the closure of fdjs lhs
            }
            // if(lhs of fdi === rhs of fdj) {
            //     append rhs of fdi to the closure of fdjs lhs
            // }
        }
    }

    for(var i = 0; i < combi.length; i++) {
        if(combi[i].length > 1) {
            for(var j = 0; j < combi[i].length; j++) {
                let tempChar = combi[i].charAt(j);
                for(var k = 0; k < combi.length; k++) {
                    if(combi[k] === tempChar) {
                        index = k;
                    }
                } 
                determinedBy[i] += determinedBy[index];
            }
            determinedBy[i] = removeDuplicateCharacters(determinedBy[i]);
            determinedBy[i] = sortString(determinedBy[i]);
        }
    }

    let lengths = '';
    for(var i = 0; i < combi.length; i++) {
        if(determinedBy[i] === full) {
            lengths+=(combi[i].length).toString();
        }  
    }



    for(var i = 0; i < combi.length; i++) {
        
        closuresStr += `<br/>(${combi[i]})﹢ -> ${determinedBy[i]}`; 
        if(determinedBy[i] === full) {
            if(combi[i].length == lengths.charAt(0)) {
                primes += combi[i];
                closuresStr += ` --> Candidate Key`;
            } else {
                closuresStr += ` --> Superkey`;
            }
        }      
        
    
    }


    
}

const findPrimes = (full, unformattedInput) => {
    let tempFull = full;
    primes = removeDuplicateCharacters(primes);
    primes = sortString(primes);
    for(var i = 0; i < full.length; i++) {
        tempFull = tempFull.replace(primes[i], '');
        notPrimes = tempFull;
    }
    primes = primes.split('').join(', ');
    notPrimes = removeDuplicateCharacters(notPrimes);
    notPrimes = sortString(notPrimes);
    notPrimes = notPrimes.split('').join(', ');
    primesOutput += `<br/>All prime attributes: ${primes}`;
    primesOutput += `<br/>All non-prime attributes: ${notPrimes}`;
}



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
        for(var j = 0; j < tempCanonicalCover[i][0].length; j++) {
            if(tempCanonicalCover[i][0].length > 1) {
                smallerLHS = removeCharacter(tempCanonicalCover[i][0], j);//`${tempCanonicalCover[i][0].substring(0, j)}${tempCanonicalCover[i][0].substring(j+1)}`; 
                //document.getElementById("val5").innerHTML = `hi ${smallerLHS}`;
                smallerLHS = sortString(smallerLHS);
                if(determinedBy[combi.indexOf(smallerLHS)].includes(tempCanonicalCover[i][1])) {
                    tempCanonicalCover[i][0] = smallerLHS;
                }
            }
        }
    }
    tempCanonicalCover = tempCanonicalCover.map(JSON.stringify).reverse().filter(function (e, i, a) {
        return a.indexOf(e, i+1) === -1;
    }).reverse().map(JSON.parse);
    

    //Step 3: Create attribute closures for the new set of decomposed attributes created by Step 2 
    // Then remove one of the FDs. If the closures of new LHS's are the same without the removed, then remove the FD entirely
    let removedFDs = [];
    var tempClosures = new Array(tempCanonicalCover.length-1).fill('');
    let removedCanonicalCover = new Array(tempCanonicalCover.length-1).fill(0).map(() => new Array(2).fill(''));
    for(var m = 0; m < tempCanonicalCover.length; m++) {
        //Deletes an FD
        removedCanonicalCover = removeFD(tempCanonicalCover, m);
        //Reflexivity and all direct FDs
        for(var i = 0; i < removedCanonicalCover.length; i++) {
            tempClosures[i] = (removedCanonicalCover[i][0] + removedCanonicalCover[i][1]);
            tempClosures[i] = removeDuplicateCharacters(tempClosures[i]);
            tempClosures[i] = sortString(tempClosures[i]);
        }
        //Check for the first layer of transitivity
        for(var i= 0; i < removedCanonicalCover.length; i++) {
            for(var j= 0; j < removedCanonicalCover.length; j++) {
                if(includesInAnyOrder(removedCanonicalCover[i][0], removedCanonicalCover[j][1])) {
                    tempClosures[j] += removedCanonicalCover[i][1];
                    tempClosures[j] = removeDuplicateCharacters(tempClosures[j]);
                    tempClosures[j] = sortString(tempClosures[j]);
                }
            }
        }
        //Check for the remaining layers of transitivity
        for(var i= 0; i < tempClosures.length; i++) {
            for(var j= 0; j < tempClosures.length; j++) {
                if(includesInAnyOrder(tempClosures[i], tempClosures[j])) {
                    tempClosures[j] += tempClosures[i];
                    tempClosures[j] = removeDuplicateCharacters(tempClosures[j]);
                    tempClosures[j] = sortString(tempClosures[j]);
                }
            }
        }
        // This appends all the single letter attributes closures to x-
        //letter attribute closures.
        for(var i = 0; i < removedCanonicalCover.length; i++) {
            if(removedCanonicalCover[i][0].length > 1) {
                for(var j = 0; j < removedCanonicalCover[i][0].length; j++) {
                    let tempChar = removedCanonicalCover[i][0].charAt(j);
                    for(var k = 0; k < removedCanonicalCover.length; k++) {
                        if(removedCanonicalCover[k][0] === tempChar) {
                            index = k;
                        }
                    } 
                    tempClosures[i] += tempClosures[index];
                }
                tempClosures[i] = removeDuplicateCharacters(tempClosures[i]);
                tempClosures[i] = sortString(tempClosures[i]);
            }
        }
        //Check to see the indices from tempCanonicalCover that need to be removed
        var needToRemove = true;
        let canonicalCover = '';
        for(var i = 0; i < tempClosures.length; i++) {
            index = combi.indexOf(removedCanonicalCover[i][0]);
            if(determinedBy[index] == tempClosures[i]) {
                needToRemove = needToRemove && true;
            } else {
                needToRemove = needToRemove && false;
            }
        }
        if(needToRemove) {
            removedFDs.push(m);
        }
    }
    let numOfFDs = tempCanonicalCover.length - removedFDs.length;
    
    finalDecomposedCanonicalCover = new Array(numOfFDs).fill(0).map(() => new Array(2).fill(''));
    for(var i = 0; i < tempCanonicalCover.length; i++) {
        if(!(removedFDs.includes(i))) {
            finalDecomposedCanonicalCover[i][0] = tempCanonicalCover[i][0];
            finalDecomposedCanonicalCover[i][1] = tempCanonicalCover[i][1];
        }
    }
    
    

    // for(var i = 0; i < tempCanonicalCover.length; i++) {   
    //     canonicalCover += `<br/>${tempCanonicalCover[i][0]} -> ${tempCanonicalCover[i][1]}`; 
    // }
    // canonicalCover += `<br/>`;
    // for(var i = 0; i < removedCanonicalCover.length; i++) {   
    //     canonicalCover += `<br/>${removedCanonicalCover[i][0]} -> ${removedCanonicalCover[i][1]} + ${tempClosures[i]}`; 
    // }
    // document.getElementById("val5").innerHTML = `${canonicalCover}`;
    // break;


    
    

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





























    
    /*
    let tempUniqueElemsClosures = [];
    var uniqueElemsClosures = [];
    var uniqueElems = []; 
    var reducedCover = tempCanonicalCover;
    for(var i = 0; i < tempCanonicalCover.length; i++) {
        uniqueElems[i] = tempCanonicalCover[i][0];
    }
    
    uniqueElems = uniqueElems.filter(distinct);
    for(var i = 0; i < tempCanonicalCover.length; i++) {
        uniqueElemsClosures[i] = determinedBy[combi.indexOf(uniqueElems[i])];
    }
    let removedCanonicalCover = new Array(totLength-1).fill(0).map(() => new Array(2).fill(''));
   
    for(var m = 0; m < tempCanonicalCover.length; m++) {
        removedCanonicalCover = deleteRow(tempCanonicalCover, m); 
        //document.getElementById("val8").innerHTML = `${m} <br/>${tempCanonicalCover}`;
        // This calculates a tempCanonicalCover
        for(var i = 0; i < removedCanonicalCover.length; i++) {
            index = uniqueElems.indexOf(removedCanonicalCover[i][0]);
            tempUniqueElemsClosures[index] = '';
            tempUniqueElemsClosures[index] += removedCanonicalCover[i][1];
            tempUniqueElemsClosures[index] = removeDuplicateCharacters(tempUniqueElemsClosures[index]);
            tempUniqueElemsClosures[index] = sortString(tempUniqueElemsClosures[index]);
        }
        
        for(var i= 0; i < removedCanonicalCover.length; i++) {
            for(var j= 0; j < removedCanonicalCover.length; j++) {
                //document.getElementById("val5").innerHTML = `${removedCanonicalCover[i][0]} ${removedCanonicalCover[j][1]}`;
                if(includesInAnyOrder(removedCanonicalCover[i][0], removedCanonicalCover[j][1])) {
                    
                    index = uniqueElems.indexOf(removedCanonicalCover[j][0]);
                    tempUniqueElemsClosures[index] += removedCanonicalCover[i][1];
                    tempUniqueElemsClosures[index] = removeDuplicateCharacters(tempUniqueElemsClosures[index]);
                    tempUniqueElemsClosures[index] = sortString(tempUniqueElemsClosures[index]);
                    //append unformattedInput[i][1] to the closure of fdjs lhs
                }
                // if(lhs of fdi === rhs of fdj) {
                //     append rhs of fdi to the closure of fdjs lhs
                // }
            }
        }
        // document.getElementById("val5").innerHTML = `hi ${tempCanonicalCover.toString()}<br/><br/>${removedCanonicalCover.toString()}`;
        for(var i= 0; i < uniqueElems.length; i++) {
            let qu = 0;
            
            while(true) {
                
                // document.getElementById("val5").innerHTML = `hi  ${qu} `;
                // document.getElementById("val5").innerHTML = `hi  ${qu} ${tempUniqueElemsClosures[qu]} ${uniqueElems[i]}`;
                if(includesInAnyOrder(uniqueElems[i], tempUniqueElemsClosures[qu])) {
                //if(unformattedInput[i][0] === unformattedInput[j][1]) {
                    // index = combi.indexOf(combi[j]);
                    
                    tempUniqueElemsClosures[qu] += tempUniqueElemsClosures[i];
                    tempUniqueElemsClosures[qu] = removeDuplicateCharacters(tempUniqueElemsClosures[qu]);
                    tempUniqueElemsClosures[qu] = sortString(tempUniqueElemsClosures[qu]);
                    //append unformattedInput[i][1] to the closure of fdjs lhs
                    
                }
                
                qu+=1;
                // document.getElementById("val5").innerHTML = `hi `;
                if(qu >= tempUniqueElemsClosures.length) {
                    
                    break;
                }
                
            }
        }
        
        for(var i = 0; i < uniqueElems.length; i++) {
            if(uniqueElems[i].length > 1) {
                for(var j = 0; j < uniqueElems[i].length; j++) {
                    let tempChar = uniqueElems[i].charAt(j);
                    for(var k = 0; k < uniqueElems.length; k++) {
                        if(uniqueElems[k] === tempChar) {
                            index = k;
                        }
                    } 
                    tempUniqueElemsClosures[i] += tempUniqueElemsClosures[index];
                }
                tempUniqueElemsClosures[i] = removeDuplicateCharacters(tempUniqueElemsClosures[i]);
                tempUniqueElemsClosures[i] = sortString(tempUniqueElemsClosures[i]);
            
            }
        }
        
        for(var i = 0; i < uniqueElems.length; i++) {
            if(uniqueElemsClosures[i] == tempUniqueElemsClosures[i]) {
                tempCanonicalCover = removedCanonicalCover;
            }
        }
    }
    // for(var i = 0; i < uniqueElems.length; i++) {
    //     tempUniqueElemsClosures = tempUniqueElemsClosures.filter(x => x !== undefined);
    // }

    finalCanonicalCover = new Array(tempCanonicalCover.length).fill(0).map(() => new Array(2).fill(''));
    for(var i = 0; i < tempCanonicalCover.length; i++) {
        finalCanonicalCover[i][0] = tempCanonicalCover[i][0];
    }
    
    // Step 4: Consolidate all the FDs with the same LHS
    for(var i = 0; i < tempCanonicalCover.length; i++) {
        for(var j = i; j < tempCanonicalCover.length; j++) {
            if(tempCanonicalCover[i][0] == tempCanonicalCover[j][0]) {
                index = uniqueElems.indexOf(tempCanonicalCover[i][0]);
                finalCanonicalCover[index][1] += `${tempCanonicalCover[i][1]}${tempCanonicalCover[j][1]}`;
                finalCanonicalCover[index][1] = removeDuplicateCharacters(finalCanonicalCover[index][1]);
                finalCanonicalCover[index][1] = sortString(finalCanonicalCover[index][1]);
            }
        }
    }*/
    // for(all of the split fds) {
    //     for(all of the split fds) {
    //         if(LHSof FD[i] == LHSofFD[j]) {
    //             combine the RHS's of both 
    //         }
    //     }
    // }
    
    // Print Fmin
    canonicalCover = `<br/>The canonical or minimum spanning cover for this relation is: `
    for(var i = 0; i < finalDecomposedCanonicalCover.length; i++) {   
        canonicalCover += `<br/>${finalDecomposedCanonicalCover[i][0]} -> ${finalDecomposedCanonicalCover[i][1]}`; 
    }
    // canonicalCover += `<br/>uniqueElems: <br/>`;
    // for(var i = 0; i < uniqueElems.length; i++) {   
    //     canonicalCover += `<br/>${uniqueElems[i]} -> ${tempUniqueElemsClosures[i]}`; 
    // }
    // canonicalCover += `<br/>finalCanonicalCover: <br/>`;
    // for(var i = 0; i < finalCanonicalCover.length; i++) {   
    //     canonicalCover += `<br/>${finalCanonicalCover[i][0]} -> ${finalCanonicalCover[i][1]}`; 
    // }
}
let threeNF = [];
const thirdNormalForm = (full, unformattedInput) => {
    
    for(var i = 0; i < finalDecomposedCanonicalCover.length; i++) {
        threeNF.push(`${finalDecomposedCanonicalCover[i][0]}${finalDecomposedCanonicalCover[i][1]}`);
    }
    
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
                threeNF = removeItemOnce(threeNF, j);
            }
        }
    }
    
    
    final3NF = `<br/>The third normal form decomposition using canonical cover is: `;
    for(var i = 0; i < threeNF.length; i++) {   
        final3NF += `<br/>R${i+1} = ${threeNF[i]}`; // with FDs ${threeNF[i]}
        if(!(i == threeNF.length-1)) {
            final3NF += ` with FD: ${finalDecomposedCanonicalCover[i][0]} -> ${finalDecomposedCanonicalCover[i][1]}`;
        }
        else {
            final3NF += ` with no FDs`;
        }
    }
}

/*const BCNF = (full, unformattedInput) => {
    let FDsViolate = false;
    let s = [];
    s.push(full);
    for(var i = 0; i < unformattedInput.length; i++) {
        if(violatesBCNF(full, unformattedInput[i][0])) {
            FDsViolate = true;
            break;
        }
    }
    // if(FDsViolate) {
        
    // }
}
*/







// Helper functions
function removeDuplicateCharacters(string) {
    return string
      .split('')
      .filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      })
      .join('');
}

const violatesBCNF = (full, LHS) => {
    if(includesInAnyOrder(full, determinedBy[combi.indexOf(LHS)])) {
        return false;
    }
    return true;
}

// const testS = (s) => {
//     for(var i = 0; i < s.length; i++) {
//         // if(s[i])
//     }
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

// String.prototype.removeCharAt = function (i) {
//     var tmp = this.split(''); // convert to an array
//     tmp.splice(i, 1); // remove 1 element from the array (adjusting for non-zero-indexed counts)
//     return tmp.join(''); // reconstruct the string
// }

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


    // let chars1 = str1.split('');
    // let chars2 = str2.split('');
    // strCombs = substringsCombs(str2);
    // //document.getElementById("val3").innerHTML = 'hi';
    // for(var i = 0; i < strCombs.length; i++) {
    //     if(strCombs[i].includes(str1)) {
    //         return true;
    //     }
        
    // }
    // return false;


    // if(str1 is included in any order of str2) {
    //     return true;
    // }
}


function substringsCombs(string)
{
    var results = [];

    if (string.length === 1) {
        results.push(string);
        return results;
    }

    for (var i = 0; i < string.length; i++) {
        var firstChar = string[i];
        var charsLeft = string.substring(0, i) + string.substring(i + 1);
        var innerPermutations = getAllPermutations(charsLeft);
        for (var j = 0; j < innerPermutations.length; j++) {
        results.push(firstChar + innerPermutations[j]);
        }
    }
    return results;
}
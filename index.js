const properties = [
  { name: "T", time: 5, rate: 1500 },
  { name: "P", time: 4, rate: 1000 },
  { name: "C", time: 10, rate: 3000 },
];

// recursive search over all sequences of developments
function search(n, currTime, currProfit, count, solutions, best) {
  let canAdd = false;
  for (let prop of properties) {
    if (currTime + prop.time < n) {
      // add if the building finishes before time n
      canAdd = true;
      let finish = currTime + prop.time;
      let addProfit = (n - finish) * prop.rate;
      // copy count and update for current property
      let newCount = { ...count };
      newCount[prop.name] = (newCount[prop.name] || 0) + 1;
      search(n, finish, currProfit + addProfit, newCount, solutions, best);
    }
  }
  // check if this sequence is right
  if (!canAdd) {
    // ifcurrent profit is greater than the best found, reset solutions
    if (currProfit > best.value) {
      best.value = currProfit;
      solutions.length = 0; // clear solutions array
    }
    // f profit equals best profit, add solution
    if (currProfit === best.value) {
      let sol = {
        T: count.T || 0,
        P: count.P || 0,
        C: count.C || 0,
      };
      let key = `${sol.T}-${sol.P}-${sol.C}`;
      if (!best.solKeys.has(key)) {
        best.solKeys.add(key);
        solutions.push(sol);
      }
    }
  }
}

// function to handle calculation.
function calculateSolution() {
  const n = parseInt(document.getElementById("timeInput").value);
  if (isNaN(n) || n <= 0) {
    alert("Please enter a positive integer for time units");
    return;
  }
  let solutions = [];
  let best = { value: -Infinity, solKeys: new Set() };
  search(n, 0, 0, {}, solutions, best);

  // Display result
  let resultDiv = document.getElementById("result");
  let html = `<h3>Results for Time Unit: ${n}</h3>`;
  html += `<p>Maximum Earnings: $${best.value}</p>`;
  if (solutions.length > 0) {
    html += `<p>Solutions (Format: T: number, P: number, C: number):</p><ul>`;
    solutions.forEach((sol) => {
      html += `<li>T: ${sol.T}, P: ${sol.P}, C: ${sol.C}</li>`;
    });
    html += `</ul>`;
  } else {
    html += `<p>No valid development schedule found.</p>`;
  }
  resultDiv.innerHTML = html;
}

document.getElementById("calcBtn").addEventListener("click", calculateSolution);

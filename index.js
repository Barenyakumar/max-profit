
const buildings = [
    { name: "T", buildTime: 5, dailyProfit: 1500 },
    { name: "P", buildTime: 4, dailyProfit: 1000 },
    { name: "C", buildTime: 10, dailyProfit: 3000 }
];


function calculateOperationalDays(finishDay, totalDays) {
    return totalDays - finishDay;
}


function combineBuildingWithPlans(buildingName, futurePlans) {
    return futurePlans.map(plan => [buildingName, ...plan]);
}


function updateBestSolution(candidateProfit, candidatePlans, bestSolution) {
    if (candidateProfit > bestSolution.profit) {
        bestSolution.profit = candidateProfit;
        bestSolution.plans = candidatePlans;
    } else if (candidateProfit === bestSolution.profit) {
        bestSolution.plans = bestSolution.plans.concat(candidatePlans);
    }
}


function solveMaxProfit(T) {
    const memo = {};


    function dp(day) {
        // no time left to build
        if (day > T) {
            return { profit: 0, plans: [[]] };
        }
        // return if any result if available.
        if (memo[day]) return memo[day];

        let bestSolution = { profit: 0, plans: [[]] };

        // building option.
        for (let b of buildings) {
            const finishDay = day + b.buildTime - 1;
            if (finishDay <= T) {
                const operationalDays = calculateOperationalDays(finishDay, T);
                const currentProfit = b.dailyProfit * operationalDays;

                const futureResult = dp(finishDay + 1);
                const totalProfit = currentProfit + futureResult.profit;

                // combining current building with future plans.
                const currentPlans = combineBuildingWithPlans(b.name, futureResult.plans);

                updateBestSolution(totalProfit, currentPlans, bestSolution);
            }
        }

        // cache the result and retun
        memo[day] = bestSolution;
        return bestSolution;
    }

    return dp(1); // building on day 1.
}


function planToCounts(plan) {
    let tCount = 0, pCount = 0, cCount = 0;
    for (let b of plan) {
        if (b === "T") tCount++;
        else if (b === "P") pCount++;
        else if (b === "C") cCount++;
    }
    return `T: ${tCount}  P: ${pCount}  C: ${cCount}`;
}


function calculateAndDisplay() {
    const T = parseInt(document.getElementById("totalDays").value, 10);
    if (isNaN(T) || T < 1) {
        alert("enter a valid integer T >= 1.");
        return;
    }

    const result = solveMaxProfit(T);
    const { profit, plans } = result;

    // duplicate plans if any
    const uniquePlanStrings = Array.from(new Set(plans.map(p => p.join(','))));
    const uniquePlans = uniquePlanStrings.map(s => s.split(','));

    // the output string
    let output = `For T = ${T}, Max Profit = $${profit}\n`;
    output += "Possible Solutions:\n";
    uniquePlans.forEach((plan, idx) => {
        output += `${idx + 1}. ${planToCounts(plan)}\n`;
    });

    document.getElementById("results").textContent = output;
}


document.getElementById("calcButton").addEventListener("click", calculateAndDisplay);
calculateAndDisplay();
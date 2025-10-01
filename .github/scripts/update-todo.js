const fs = require("fs");

const todoFile = "spiral-todo.json";
const resultsFile = "results.json";

let todo = JSON.parse(fs.readFileSync(todoFile, "utf8"));
let results = JSON.parse(fs.readFileSync(resultsFile, "utf8"));

// Map Postman test names to ToDo task IDs
const mapping = {
  "Health check returns ok": 1,
  "Security scan passes": 2,
  "Shopper onboarding works": 3,
  "Retailer onboarding works": 4,
  "Mall onboarding works": 5,
  "SPIRALS earn/redeem works": 6,
  "Admin promotions loop works": 7,
  "Legal consent logging works": 8
};

// Collect all passed test names
const passedTests = new Set();
results.run.executions.forEach(exec => {
  exec.assertions?.forEach(assertion => {
    if (assertion.error === undefined) {
      passedTests.add(assertion.assertion);
    }
  });
});

// Update tasks
for (let task of todo.tasks) {
  for (let [testName, taskId] of Object.entries(mapping)) {
    if (task.id === taskId && passedTests.has(testName)) {
      task.status = "complete";
    }
  }
}

fs.writeFileSync(todoFile, JSON.stringify(todo, null, 2));
console.log("✅ spiral-todo.json updated with test results");
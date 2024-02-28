import convertObjectToVariableGroup from "./variable-group-converter.js";

let inputElement = document.getElementById("inputData");
let outputElement = document.getElementById("output");

let azureDevops = {
  url: document.getElementById("azureDevopsUrl"),
  organization: document.getElementById("organization"),
  teamProject: document.getElementById("team-project"),
  variableGroupName: document.getElementById("variable-group"),
  variableGroupData: document.getElementById("azure-devops-data"),
};

let variableGroups = {};

let validAuthorizationHeader = false;
let authorizationHeaderValue = window.localStorage.getItem("pat");

document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault();

  try {
    let input = JSON.parse(inputElement.value);
    console.log(input);
    outputElement.textContent = JSON.stringify(
      convertObjectToVariableGroup(input),
      null,
      2
    );
  } catch (error) {
    console.log(inputElement.value);
    alert("JSON Invalido");
  }

  console.log("Form submitted");
});

document
  .getElementById("organizationDetails")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    if (!authorizationHeaderValue) {
      let pat = `:${prompt("Por favor proporciona tu Personal Access Token")}`;

      authorizationHeaderValue = `Basic ${btoa(pat)}`;

      window.localStorage.setItem("pat", authorizationHeaderValue);
    }

    let url = `https://dev.azure.com/${azureDevops.organization.value}/${azureDevops.teamProject.value}/_apis/distributedtask/variablegroups/?api-version=7.2-preview.2`;
    fetchVariableGroupsData(url, authorizationHeaderValue)
      .then((res) =>
        res.value.find(
          (variableGroup) =>
            variableGroup.name === azureDevops.variableGroupName.value
        )
      )
      .then((variableGroup) => {
        azureDevops.url.textContent = `https://dev.azure.com/${azureDevops.organization.value}/${azureDevops.teamProject.value}/_apis/distributedtask/variablegroups/${variableGroup.id}?api-version=7.2-preview.2`;

        azureDevops.variableGroupData.value = JSON.stringify(
          variableGroup.variables,
          null,
          2
        );
      })
      .catch();

    console.log("Form submitted");
  });

function fetchVariableGroupsData(url, authorization) {
  if (!validAuthorizationHeader) {
    const response = fetch(url, {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
    })
      .then((res) => {
        validAuthorizationHeader = true;
        return res.json();
      })
      .catch((error) => {
        window.localStorage.removeItem("pat");
        authorizationHeaderValue = "";
        validAuthorizationHeader = false;
        console.error("There was a problem with your fetch operation:", error);
      });

    variableGroups = response;
  }

  return variableGroups;
}

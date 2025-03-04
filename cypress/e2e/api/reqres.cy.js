import "cypress-each";

const testData = require('../../fixtures/users.json')
const maxResponseTime = 150; 

describe("Reqres.io API testing", () => {

  it("API Testing - GET list of users", () => {
    cy.request("GET", "https://reqres.in/api/users?page=2").then((response) => {
      expect(response.status).to.eq(200);

      // Validate response body
      const users = response.body.data; // Access the 'data' array
      const firstUser = users[0]; // First user in the array
      const secondUser = users[1]; // Second user in the array

      console.log(firstUser);
      expect(response.body).to.have.property("total", 12);
      expect(firstUser).to.have.property("last_name", "Lawson");
      expect(secondUser).to.have.property("last_name", "Ferguson");

      // Test types
      expect(response.body).to.have.property("page").that.is.a("number");
      expect(response.body).to.have.property("per_page").that.is.a("number");
      expect(response.body).to.have.property("total").that.is.a("number");
      expect(response.body).to.have.property("total_pages").that.is.a("number");
      expect(response.body).to.have.property("data").that.is.an("array");

      expect(firstUser).to.have.property("id").that.is.a("number");
      expect(firstUser).to.have.property("email").that.is.a("string");
      expect(firstUser).to.have.property("first_name").that.is.a("string");
      expect(firstUser).to.have.property("last_name").that.is.a("string");
      expect(firstUser).to.have.property("avatar").that.is.a("string");
    });
  });

  testData.forEach((user) => {
    it(`API Testing - POST user with name: ${user.name} and job: ${user.job} and verify data types.`, () => {

      const payload = {
        name: user.name,
        job: user.job,
      };
  
      cy.request("POST", "https://reqres.in/api/users", payload).then(
        (response) => {
          expect(response.status).to.eq(201);
  
          // Validate response body
          expect(response.body).to.have.property('name',user.name);
          expect(response.body).to.have.property('job',user.job);

          expect(response.body).to.have.property('name').that.is.a('string');
          expect(response.body).to.have.property('job').that.is.a('string');
          expect(response.body).to.have.property('id').that.is.a('string');
          expect(response.body).to.have.property('createdAt').that.is.a('string');
          expect(response.body.createdAt).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/); // ISO 8601 

          expect(response.duration).to.be.lessThan(maxResponseTime);
        }
      );
    });
  });

});

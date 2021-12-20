describe('View Dealerships Test', () => {
    it('Visits the dealerships page and view list of dealerships', () => {
        //Setting the token in the local storage to be able to access dashboard page
        cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MThhYWNmNDVjZGM3NWI4Mjg4ZWI5YjUiLCJpYXQiOjE2MzgxMjkxMzAsImV4cCI6MTY0MDcyMTEzMH0.dJTD0ZWeL9Y6okiFwB4r5g7cbugVAmW6IU_BbKCGmIg')
        cy.visit('/#/dashboard')
        //Clicking on the dealership item in the side nav bar
        cy.get("[href='#/dealerships']")
        .click()
        //Verifying the the list of registered dealership is visible
        cy.contains("List of registered dealerships");
    })
  })

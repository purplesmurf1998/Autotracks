describe('View Inventory Test', () => {
    it('Visits the inventory page and views the inventory', () => {
        //Setting the token in the local storage to be able to access dashboard page
        cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MThhYWNmNDVjZGM3NWI4Mjg4ZWI5YjUiLCJpYXQiOjE2MzgxMjkxMzAsImV4cCI6MTY0MDcyMTEzMH0.dJTD0ZWeL9Y6okiFwB4r5g7cbugVAmW6IU_BbKCGmIg')
        cy.visit('/#/dashboard')
        //Clicking on the dealership item in the side nav bar
        cy.get("[href='#/inventory']")
        .click()
        //Verifying the the list of registered dealership is visible
        cy.contains("Select a dealership to view their inventory");
    })
  })

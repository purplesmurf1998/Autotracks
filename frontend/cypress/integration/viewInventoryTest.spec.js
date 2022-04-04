describe('View Inventory Test', () => {
    it('Visits the inventory page and views the inventory', () => {
        //Setting the token in the local storage to be able to access dashboard page
        cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDg5NzYyNzgsImV4cCI6MTY1MTU2ODI3OH0.jr3dlo-sY2bjgYHiDRJ0xD6xImfaxeS9zxvMoUf-1d0')
        cy.visit('/#/dashboard')
        //Clicking on the dealership item in the side nav bar
        cy.get("[href='#/inventory']")
        .click()
        //Verifying the the list of registered dealership is visible
        cy.contains("Select a dealership to view their inventory");
    })
  })

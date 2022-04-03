describe('View Dealerships Test', () => {
    it('Visits the dealerships page and view list of dealerships', () => {
        //Setting the token in the local storage to be able to access dashboard page
        cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDg5NzYyNzgsImV4cCI6MTY1MTU2ODI3OH0.jr3dlo-sY2bjgYHiDRJ0xD6xImfaxeS9zxvMoUf-1d0')
        cy.visit('/#/dashboard')
        //Clicking on the dealership item in the side nav bar
        cy.get("[href='#/dealerships']")
        .click()
        //Verifying the the list of registered dealership is visible
        cy.contains("List of registered dealerships");
    })
  })

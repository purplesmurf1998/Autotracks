describe('View Users Test', () => {
    it('Visits the dealerships page and view list of staff members for a given dealership', () => {
        //Setting the token in the local storage to be able to access dealership page
        cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDI1MjYwNjIsImV4cCI6MTY0NTExODA2Mn0.VJ_fSlQS8wS4tjPSOGGmmTRk0RK3Jnkbu-m5lc-kLhE')
        //Visiting the dealership page
        cy.visit('/#/dealerships')
        //Loading the dealership takes a slight amount of time, so without this wait the test fails as cy.get("tr").eq(3) will fail
        cy.wait(1000)        
        //Clicking on a table row which represents a dealership
        cy.get("tr").eq(3)
        .click()

        //Checking if the selected dealership contains a list of staff accounts
        cy.contains("List of staff accounts")

        //Validating that a user ID exists for that given dealership
        cy.get("#618800e83c70133a04cea4ce").should('exist')
        .click()

        //Validating the existence of the email field for a given user
        cy.contains("abdul@gmail.com")

    })
  })

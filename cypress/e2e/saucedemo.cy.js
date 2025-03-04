describe("Saucedemo.com tests", () => {
  beforeEach(() => {
    cy.visit("http://www.saucedemo.com/");
  });

  it("Site can be entered and form is shown", () => {
    cy.contains(/Swag Labs/i);
  });

  it("Sucessfull login", () => {
    cy.getDataTest("username").type("standard_user");
    cy.getDataTest("password").type("secret_sauce");
    cy.getDataTest("login-button").click();
    cy.getDataTest("inventory-list").should("exist");
  });

  it("Unsucessfull login", () => {
    cy.getDataTest("username").type("locked_out_user");
    cy.getDataTest("password").type("secret_sauce");
    cy.getDataTest("login-button").click();
    cy.getDataTest("error").should(
      "have.text",
      "Epic sadface: Sorry, this user has been locked out."
    );
  });

  it("Login without password", () => {
    cy.getDataTest("username").type("standard_user");
    cy.getDataTest("login-button").click();
    cy.getDataTest("error").should(
      "have.text",
      "Epic sadface: Password is required"
    );
  });

  it("A to Z Sorting test", () => {
    cy.getDataTest("username").type("standard_user");
    cy.getDataTest("password").type("secret_sauce");
    cy.getDataTest("login-button").click();
    cy.getDataTest("inventory-list").should("exist");

    cy.getDataTest("product-sort-container").select("az");

    cy.getDataTest("inventory-item-name").then(($elements) => {
      const texts = $elements
        .toArray()
        .map((element) => element.innerText.trim());
      const sortedTexts = [...texts].sort((a, b) => a.localeCompare(b));

      expect(texts).to.deep.equal(sortedTexts);
    });
  });

  it("Z to A Sorting test", () => {
    cy.getDataTest("username").type("standard_user");
    cy.getDataTest("password").type("secret_sauce");
    cy.getDataTest("login-button").click();
    cy.getDataTest("inventory-list").should("exist");

    cy.getDataTest("product-sort-container").select("za");

    cy.getDataTest("inventory-item-name").then(($elements) => {
      const texts = $elements
        .toArray()
        .map((element) => element.innerText.trim());
      const sortedTexts = [...texts].sort((a, b) => b.localeCompare(a));

      expect(texts).to.deep.equal(sortedTexts);
    });
  });

  it("Price low to high sorting test", () => {
    cy.getDataTest("username").type("standard_user");
    cy.getDataTest("password").type("secret_sauce");
    cy.getDataTest("login-button").click();
    cy.getDataTest("inventory-list").should("exist");

    cy.getDataTest("product-sort-container").select("lohi");

    cy.getDataTest("inventory-item-price").then(($elements) => {
      const prices = $elements.toArray().map((element) => {
        const priceText = element.innerText.trim();
        const priceValue = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
        return priceValue;
      });

      const sortedPrices = [...prices].sort((a, b) => a - b);

      expect(prices).to.deep.equal(sortedPrices);
    });
  });

  it("Price high to low sorting test", () => {
    cy.getDataTest("username").type("standard_user");
    cy.getDataTest("password").type("secret_sauce");
    cy.getDataTest("login-button").click();
    cy.getDataTest("inventory-list").should("exist");

    cy.getDataTest("product-sort-container").select("hilo");

    cy.getDataTest("inventory-item-price").then(($elements) => {
      const prices = $elements.toArray().map((element) => {
        const priceText = element.innerText.trim();
        const priceValue = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
        return priceValue;
      });

      const sortedPrices = [...prices].sort((a, b) => b - a);

      expect(prices).to.deep.equal(sortedPrices);
    });
  });

  it("Adding product to cart and verify label, description and price", () => {
    cy.getDataTest("username").type("standard_user");
    cy.getDataTest("password").type("secret_sauce");
    cy.getDataTest("login-button").click();
    cy.getDataTest("inventory-list").should("exist");

    cy.getDataTest("inventory-item")
      .its(0)
      .within(() => {
        cy.getDataTest("inventory-item-name").invoke("text").as("item-label")
        cy.getDataTest("inventory-item-desc").invoke("text").as("item-descr")
        cy.getDataTest("inventory-item-price").invoke("text").as("item-price");
        cy.get(".btn").click();
      });

    cy.getDataTest("shopping-cart-badge").click();

    cy.get("@item-label").then((itemLabel) => {
      cy.getDataTest("inventory-item-name").should("have.text", itemLabel);
    });

    cy.get("@item-descr").then((itemDescription) => {
      cy.getDataTest("inventory-item-desc").should("have.text", itemDescription);
    });

    cy.get("@item-price").then((pageTitle) => {
      cy.getDataTest("inventory-item-price").should("have.text", pageTitle);
    });

  });

  it("Adding product to cart and removing them ", () => {
    cy.getDataTest("username").type("standard_user");
    cy.getDataTest("password").type("secret_sauce");
    cy.getDataTest("login-button").click();
    cy.getDataTest("inventory-list").should("exist");

    cy.getDataTest("inventory-item")
      .its(0)
      .within(() => {
        cy.get(".btn").click();
      });

    cy.getDataTest("shopping-cart-badge").click();
    cy.get(".item_pricebar button").click()
    cy.getDataTest("inventory-item").should("not.exist")
  });
  
  it("Add product and get to checkout", () => {
    cy.getDataTest("username").type("standard_user");
    cy.getDataTest("password").type("secret_sauce");
    cy.getDataTest("login-button").click();
    cy.getDataTest("inventory-list").should("exist");

    cy.getDataTest("inventory-item")
      .its(0)
      .within(() => {
        cy.get(".btn").click();
      });

    cy.getDataTest("shopping-cart-badge").click();
    cy.getDataTest("checkout").click()
  });

  it("Checkout the product and return home", () => {
    cy.getDataTest("username").type("standard_user");
    cy.getDataTest("password").type("secret_sauce");
    cy.getDataTest("login-button").click();
    cy.getDataTest("inventory-list").should("exist");

    cy.getDataTest("inventory-item")
      .its(0)
      .within(() => {
        cy.get(".btn").click();
      });

    cy.getDataTest("shopping-cart-badge").click();
    cy.getDataTest("checkout").click()

    cy.getDataTest("firstName").type("test")
    cy.getDataTest("lastName").type("test")
    cy.getDataTest("postalCode").type("08000")

    cy.getDataTest("continue").click()
    cy.getDataTest("finish").click()

    cy.getDataTest("checkout-complete-container").should("exist")
    cy.getDataTest("back-to-products").click()
  });
});

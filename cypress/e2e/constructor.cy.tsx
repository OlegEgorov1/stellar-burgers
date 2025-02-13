/// <reference types="cypress" />

// Обновленные селекторы с динамическими ID ингредиентов
const SELECTORS = {
  // Кнопка добавления булки
  addBunButton: (id: string) =>
    `[data-testid=ingredient-item-${id}] button[type=button]`,
  // Кнопка добавления начинки
  addIngredientButton: (id: string) =>
    `[data-testid="ingredient-item-${id}"] button[type=button]`,
  // Отображение булок в конструкторе
  bunTop: '[data-testid=bun-top]',
  bunBottom: '[data-testid=bun-bottom]',
  betweenBuns: '[data-testid=between-buns]',
  // Модальные окна
  ingredientModalButton: (id: string) => `[data-testid=ingredient-link-${id}]`,
  modalContent: '[data-testid=modal-content]',
  modalCloseButton: '[data-testid=modal-close]',
  modalOverlay: '[data-testid=modal-overlay]',
  // Кнопка оформления заказа
  makeOrderButton: '[data-testid=make-order-button]',
  // Номер заказа в модальном окне
  orderNumber: '[data-testid="order-number"]'
};

describe('Тестирование конструктора бугера и оформления заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '/api/orders', {
      fixture: 'order.json'
    }).as('postOrder');

    // Устанавливаем токен аунтефикации
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');
    cy.setCookie('accessToken', 'Bearer mock-access-token');

    // Открываем страницу конструктора
    cy.visit('/');

    // Ожидание загрузки страницы
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  it('Проверяет доступность сервиса по адресу localhost:4000', () => {
    cy.url().should('eq', 'http://localhost:4000/');
  });

  describe('Функциональность конструктора', () => {
    it('Добавляет булку и ингредиент в конструктор', () => {
      const bunId = '643d69a5c3f7b9001cfa093c';
      const ingredientId = '643d69a5c3f7b9001cfa0941';

      // Добавляем булку
      cy.get(SELECTORS.addBunButton(bunId)).click();
      cy.get(SELECTORS.bunTop)
        .contains('Краторная булка N-200i')
        .should('exist');
      cy.get(SELECTORS.bunBottom)
        .contains('Краторная булка N-200i')
        .should('exist');

      //Добавляем ингредиент
      cy.get(SELECTORS.addIngredientButton(ingredientId)).click();
      cy.get(SELECTORS.betweenBuns)
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');
    });

    it('Открывает и закрывает модальное окно ингредиента', () => {
      const ingredientId = '643d69a5c3f7b9001cfa0941';

      // Открываем модальное окно ингредиента
      cy.get(SELECTORS.ingredientModalButton(ingredientId)).click();
      cy.get(SELECTORS.modalContent).should('be.visible');

      // Закрываем модальное окно (по кнопке)
      cy.get(SELECTORS.modalCloseButton).click();
      cy.get(SELECTORS.modalContent).should('not.exist');
    });

    it('Закрывает модальное окно по клику на оверлей', () => {
      const ingredientId = '643d69a5c3f7b9001cfa0941'; // Биокотлета

      // Открываем модальное окно ингредиента
      cy.get(SELECTORS.ingredientModalButton(ingredientId)).click();
      cy.get(SELECTORS.modalContent).should('be.visible');

      // Закрываем модальное окно (по оверлею)
      cy.get(SELECTORS.modalOverlay).click('top', { force: true });
      cy.get(SELECTORS.modalContent).should('not.exist');
    });

    it('Оформляет заказ и проверяет номер заказа', () => {
      const bunId = '643d69a5c3f7b9001cfa093c';
      const ingredientId = '643d69a5c3f7b9001cfa0941';

      // Добавляем булку
      cy.get(SELECTORS.addBunButton(bunId)).click();
      cy.get(SELECTORS.bunTop).should('exist');
      cy.get(SELECTORS.bunBottom).should('exist');

      // Добавляем ингредиент
      cy.get(SELECTORS.addIngredientButton(ingredientId)).click();
      cy.get(SELECTORS.betweenBuns).should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );

      // Нажимаем "Оформить заказ"
      cy.get(SELECTORS.makeOrderButton).click();

      // Проверяем, что модальное окно с номером заказа появилось
      cy.wait('@postOrder');
      cy.get(SELECTORS.orderNumber).should('exist');

      // Закрываем модальное окно заказа
      cy.get(SELECTORS.modalCloseButton).click();
      cy.get(SELECTORS.orderNumber).should('not.exist');

      // Проверяем, что конструктор очистился
      cy.get(SELECTORS.bunTop).should('not.exist');
      cy.get(SELECTORS.bunBottom).should('not.exist');
      cy.get(SELECTORS.betweenBuns).should('not.exist');
    });
  });
});

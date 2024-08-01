import * as model from './module.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import paginationView from './views/paginationView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { setTimeout } from 'core-js';
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    //Loading
    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
    //Rendering
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // Load search results
    await model.loadSearchResults(query);
    // Render searchResults
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    //

    paginationView.render(model.state.search);
    // paginationView._generateMarkup()
  } catch (err) {}
};
const controlPagination = function (goToPage) {
  // Render NEW Results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //
  paginationView.render(model.state.search);
  // paginationView._generateMarkup()
};
const controlServings = function (newServings) {
  //Update the recipe servings
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // Add / remove   bookmarks
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  // upadate recipe view
  recipeView.update(model.state.recipe);
  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpadateServings(controlServings);
  recipeView.addHandlerAddBookmarks(controlAddBookmark);
  searchView.addHandleSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks()

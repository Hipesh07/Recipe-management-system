package com.recipeapp.service;

import com.recipeapp.dto.RecipeDtos.IngredientDto;
import com.recipeapp.dto.RecipeDtos.RecipeRequest;
import com.recipeapp.dto.RecipeDtos.RecipeResponse;
import com.recipeapp.model.Ingredient;
import com.recipeapp.model.Recipe;
import com.recipeapp.model.User;
import com.recipeapp.repository.RecipeRepository;
import com.recipeapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    @Autowired
    public RecipeService(RecipeRepository recipeRepository, UserRepository userRepository) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
    }

    public List<RecipeResponse> getAllRecipes(String ownerEmail) {
        return recipeRepository.findByOwnerEmail(ownerEmail)
                .stream().map(this::toResponse).toList();
    }

    public Optional<RecipeResponse> getRecipeById(Long id, String ownerEmail) {
        return recipeRepository.findByIdAndOwnerEmail(id, ownerEmail).map(this::toResponse);
    }

    public RecipeResponse createRecipe(RecipeRequest request, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new IllegalStateException("Unknown user: " + ownerEmail));

        // Built fresh from the DTO - id and owner are never taken from client
        // input, which is what closes the mass-assignment/IDOR gap that
        // existed when the controller bound directly to the Recipe entity.
        Recipe recipe = new Recipe();
        recipe.setOwner(owner);
        applyRequest(recipe, request);

        return toResponse(recipeRepository.save(recipe));
    }

    public Optional<RecipeResponse> updateRecipe(Long id, RecipeRequest request, String ownerEmail) {
        return recipeRepository.findByIdAndOwnerEmail(id, ownerEmail).map(existing -> {
            applyRequest(existing, request);
            return toResponse(recipeRepository.save(existing));
        });
    }

    public boolean deleteRecipe(Long id, String ownerEmail) {
        return recipeRepository.findByIdAndOwnerEmail(id, ownerEmail).map(recipe -> {
            recipeRepository.delete(recipe);
            return true;
        }).orElse(false);
    }

    public List<RecipeResponse> searchByTitle(String title, String ownerEmail) {
        return recipeRepository.findByOwnerEmailAndTitleContainingIgnoreCase(ownerEmail, title)
                .stream().map(this::toResponse).toList();
    }

    public List<RecipeResponse> getByCategory(String category, String ownerEmail) {
        return recipeRepository.findByOwnerEmailAndCategoryIgnoreCase(ownerEmail, category)
                .stream().map(this::toResponse).toList();
    }

    // --- mapping helpers -------------------------------------------------

    private void applyRequest(Recipe recipe, RecipeRequest request) {
        recipe.setTitle(request.title);
        recipe.setDescription(request.description);
        recipe.setCategory(request.category);
        recipe.setPrepTimeMinutes(request.prepTimeMinutes);
        recipe.setCookTimeMinutes(request.cookTimeMinutes);
        recipe.setServings(request.servings);

        List<Ingredient> ingredients = new ArrayList<>();
        if (request.ingredients != null) {
            for (IngredientDto dto : request.ingredients) {
                ingredients.add(new Ingredient(dto.name, dto.quantity));
            }
        }
        recipe.setIngredients(ingredients);

        recipe.setSteps(request.steps != null ? request.steps : new ArrayList<>());
    }

    private RecipeResponse toResponse(Recipe recipe) {
        RecipeResponse response = new RecipeResponse();
        response.id = recipe.getId();
        response.title = recipe.getTitle();
        response.description = recipe.getDescription();
        response.category = recipe.getCategory();
        response.prepTimeMinutes = recipe.getPrepTimeMinutes();
        response.cookTimeMinutes = recipe.getCookTimeMinutes();
        response.servings = recipe.getServings();
        response.steps = recipe.getSteps();
        response.ingredients = recipe.getIngredients().stream()
                .map(i -> new IngredientDto(i.getName(), i.getQuantity()))
                .toList();
        return response;
    }
}

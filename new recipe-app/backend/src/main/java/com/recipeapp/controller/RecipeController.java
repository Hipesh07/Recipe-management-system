package com.recipeapp.controller;

import com.recipeapp.dto.RecipeDtos.RecipeRequest;
import com.recipeapp.dto.RecipeDtos.RecipeResponse;
import com.recipeapp.service.RecipeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    @Autowired
    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    private String currentEmail(Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("No authenticated user");
        }
        return authentication.getName();
    }

    @GetMapping
    public List<RecipeResponse> getAllRecipes(
            Authentication authentication,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category
    ) {

        String email = currentEmail(authentication);

        if (search != null && !search.isBlank()) {
            return recipeService.searchByTitle(search, email);
        }

        if (category != null && !category.isBlank()) {
            return recipeService.getByCategory(category, email);
        }

        return recipeService.getAllRecipes(email);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeResponse> getRecipeById(
            Authentication authentication,
            @PathVariable Long id
    ) {

        return recipeService
                .getRecipeById(id, currentEmail(authentication))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RecipeResponse> createRecipe(
            Authentication authentication,
            @Valid @RequestBody RecipeRequest request
    ) {

        RecipeResponse created = recipeService.createRecipe(
                request,
                currentEmail(authentication)
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeResponse> updateRecipe(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody RecipeRequest request
    ) {

        return recipeService
                .updateRecipe(
                        id,
                        request,
                        currentEmail(authentication)
                )
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(
            Authentication authentication,
            @PathVariable Long id
    ) {

        boolean deleted =
                recipeService.deleteRecipe(
                        id,
                        currentEmail(authentication)
                );

        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}

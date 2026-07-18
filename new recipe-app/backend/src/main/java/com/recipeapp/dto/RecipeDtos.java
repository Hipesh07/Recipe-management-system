package com.recipeapp.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class RecipeDtos {

    public static class IngredientDto {
        @NotBlank
        public String name;

        public String quantity;

        public IngredientDto() {}

        public IngredientDto(String name, String quantity) {
            this.name = name;
            this.quantity = quantity;
        }
    }

    /**
     * Used for both create (POST) and update (PUT). Deliberately has no "id"
     * or "owner" field, so a client can never set/override those via the
     * request body (this is what prevented the mass-assignment / IDOR issue
     * that existed when the controller bound directly to the Recipe entity).
     */
    public static class RecipeRequest {
        @NotBlank
        public String title;

        public String description;

        public String category;

        public Integer prepTimeMinutes;

        public Integer cookTimeMinutes;

        public Integer servings;

        @Valid
        @NotNull
        public List<IngredientDto> ingredients;

        public List<String> steps;
    }

    public static class RecipeResponse {
        public Long id;
        public String title;
        public String description;
        public String category;
        public Integer prepTimeMinutes;
        public Integer cookTimeMinutes;
        public Integer servings;
        public List<IngredientDto> ingredients;
        public List<String> steps;
    }
}

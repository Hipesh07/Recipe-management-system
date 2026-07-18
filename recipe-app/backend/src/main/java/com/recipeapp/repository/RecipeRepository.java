package com.recipeapp.repository;

import com.recipeapp.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByOwnerEmailAndTitleContainingIgnoreCase(String ownerEmail, String title);
    List<Recipe> findByOwnerEmailAndCategoryIgnoreCase(String ownerEmail, String category);
    List<Recipe> findByOwnerEmail(String ownerEmail);
    Optional<Recipe> findByIdAndOwnerEmail(Long id, String ownerEmail);
}

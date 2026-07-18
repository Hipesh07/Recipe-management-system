package com.recipeapp.config;

import com.recipeapp.model.Ingredient;
import com.recipeapp.model.Recipe;
import com.recipeapp.model.User;
import com.recipeapp.repository.RecipeRepository;
import com.recipeapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RecipeRepository recipeRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Only seed once — this runs on every startup, but the DB is now persistent,
        // so we guard against re-inserting the demo account and recipes each time.
        if (userRepository.existsByEmail("demo@example.com")) {
            return;
        }

        User demo = new User("demo@example.com", "Demo Cook", passwordEncoder.encode("password123"));
        userRepository.save(demo);

        Recipe pasta = new Recipe();
        pasta.setOwner(demo);
        pasta.setTitle("Garlic Butter Pasta");
        pasta.setDescription("A quick weeknight pasta with garlic, butter, and parmesan.");
        pasta.setCategory("Dinner");
        pasta.setPrepTimeMinutes(10);
        pasta.setCookTimeMinutes(15);
        pasta.setServings(4);
        pasta.setIngredients(List.of(
                new Ingredient("Spaghetti", "400 g"),
                new Ingredient("Butter", "4 tbsp"),
                new Ingredient("Garlic cloves, minced", "4"),
                new Ingredient("Parmesan cheese, grated", "50 g"),
                new Ingredient("Salt", "to taste")
        ));
        pasta.setSteps(List.of(
                "Boil salted water and cook spaghetti until al dente.",
                "Melt butter in a pan and sauté garlic until fragrant.",
                "Toss cooked pasta into the pan with butter and garlic.",
                "Stir in parmesan and season with salt before serving."
        ));

        Recipe pancakes = new Recipe();
        pancakes.setOwner(demo);
        pancakes.setTitle("Fluffy Pancakes");
        pancakes.setDescription("Classic breakfast pancakes, light and fluffy.");
        pancakes.setCategory("Breakfast");
        pancakes.setPrepTimeMinutes(10);
        pancakes.setCookTimeMinutes(10);
        pancakes.setServings(3);
        pancakes.setIngredients(List.of(
                new Ingredient("All-purpose flour", "1.5 cup"),
                new Ingredient("Sugar", "2 tbsp"),
                new Ingredient("Baking powder", "2 tsp"),
                new Ingredient("Milk", "1.25 cup"),
                new Ingredient("Egg", "1"),
                new Ingredient("Butter, melted", "3 tbsp")
        ));
        pancakes.setSteps(List.of(
                "Whisk together flour, sugar, and baking powder.",
                "In a separate bowl, mix milk, egg, and melted butter.",
                "Combine wet and dry ingredients until just mixed.",
                "Cook 1/4 cup portions on a hot griddle until bubbles form, then flip."
        ));

        recipeRepository.save(pasta);
        recipeRepository.save(pancakes);
    }
}

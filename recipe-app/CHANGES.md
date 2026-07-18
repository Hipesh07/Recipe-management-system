# Fixes applied

## 1. Root cause of the 415 (Jackson serialization)
- `Recipe.ingredients` had `@JsonManagedReference` but `Ingredient.recipe` had
  `@JsonIgnore` instead of the matching `@JsonBackReference`, causing
  `InvalidDefinitionException: no back reference property found`.
- **Fix:** removed all `@JsonManagedReference` / `@JsonBackReference` /
  `@JsonIgnore` annotations from the entities entirely, in favor of DTOs
  (see #2). Entities are never serialized directly anymore, so this class
  of bug can't recur.

## 2. DTOs for recipes
- Added `dto/RecipeDtos.java` (`RecipeRequest`, `RecipeResponse`,
  `IngredientDto`).
- `RecipeController` now binds `RecipeRequest`/returns `RecipeResponse`
  instead of the `Recipe` entity.
- `RecipeService` maps between DTOs and entities explicitly.
- This closes a mass-assignment/IDOR gap: previously a client could include
  `"id"` in a POST body and potentially overwrite another user's recipe,
  since the entity's `id` field was bindable straight from JSON.

## 3. CORS configuration
- `SecurityConfig` previously set both `allowedOrigins` (localhost:5173)
  **and** `allowedOriginPatterns("*")` with `allowCredentials(true)` —
  Spring uses the patterns when both are set, so effectively any origin
  could make authenticated requests. Removed the wildcard pattern.

## 4. Token/security leaks in logs
- `JwtAuthFilter` no longer prints the raw `Authorization` header or
  request/response details to stdout.
- `application.properties`: `logging.level.org.springframework.security`
  dropped from `DEBUG` to `INFO`.

## 5. Stack trace / error leakage
- `application.properties`: `server.error.include-stacktrace` and
  `include-message` set to `never` (were `always`).
- `GlobalExceptionHandler` now also catches `HttpMessageNotReadableException`
  and a catch-all `Exception`, so malformed requests and unexpected errors
  get a clean generic response instead of falling through to Spring's
  default (leaky) error handling.

## 6. Frontend cleanup (`api.js`)
- Removed `console.log` calls that printed the JWT and request/response
  bodies.
- Removed a dead, duplicated `createRecipe` implementation left over from
  debugging.

## Not changed, but worth knowing
- `GET /api/recipes` still triggers one lazy-load query per recipe for
  ingredients (N+1). Fine at current scale; consider an `@EntityGraph` or
  `JOIN FETCH` query if the recipe list grows large.
- `spring.h2.console.enabled=true` and the H2 file database are fine for
  local dev but should be disabled/replaced before any real deployment.
- `app.jwt.secret` in `application.properties` is a placeholder — move it
  to an environment variable before deploying anywhere.

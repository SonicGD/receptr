package main
import (
    "net/http"
    "gopkg.in/mgo.v2/bson"
    "github.com/go-martini/martini"
    "fmt"
)

func GetRecipes(r *http.Request, enc Encoder) (int, string) {
    // Get the query string arguments, if any
    //qs := r.URL.Query()
    data, err := Recipe{}.all(session, bson.M{})
    if err != nil {
        // Invalid id, or does not exist
        return http.StatusNotFound, Must(enc.Encode(NewError(ErrCodeNotExist, "no recipes found")))
    }
    return http.StatusOK, Must(enc.Encode(data))
}

func toIface(v []*Recipe) []interface{} {
    if len(v) == 0 {
        return nil
    }
    ifs := make([]interface{}, len(v))
    for i, v := range v {
        ifs[i] = v
    }
    return ifs
}

func GetRecipe(enc Encoder, parms martini.Params) (int, string) {
    id, _ := parms["id"]
    recipe, err := Recipe{}.one(session, bson.M{"_id": bson.ObjectIdHex(id)})
    if err != nil {
        // Invalid id, or does not exist
        return http.StatusNotFound, Must(enc.Encode(
        NewError(ErrCodeNotExist, fmt.Sprintf("the recipe with id %s does not exist", id))))
    }
    return http.StatusOK, Must(enc.Encode(recipe))
}

// AddAlbum creates the posted album.
func AddRecipe(recipe Recipe, enc Encoder) (int, string) {
    recipe.save(session, recipe)
    return http.StatusOK, Must(enc.Encode(recipe))
}

// UpdateAlbum changes the specified album.
func UpdateRecipe(recipe Recipe, enc Encoder) (int, string) {
    recipe.update(session, recipe);
    return http.StatusOK, Must(enc.Encode(recipe))
}


// Martini requires that 2 parameters are returned to treat the first one as the
// status code. Delete is an idempotent action, but this does not mean it should
// always return 204 - No content, idempotence relates to the state of the server
// after the request, not the returned status code. So I return a 404 - Not found
// if the id does not exist.
func DeleteRecipe(enc Encoder, parms martini.Params) (int, string) {
    id, _ := parms["id"]
    recipe, err := Recipe{}.one(session, bson.M{"_id": bson.ObjectIdHex(id)})
    if err != nil {
        // Invalid id, or does not exist
        return http.StatusNotFound, Must(enc.Encode(
        NewError(ErrCodeNotExist, fmt.Sprintf("the recipe with id %s does not exist", id))))
    }
    recipe.delete(session, recipe)
    return http.StatusNoContent, ""
}
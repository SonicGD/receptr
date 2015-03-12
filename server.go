package main

import (
	"github.com/go-martini/martini"
	"github.com/martini-contrib/cors"
	"gopkg.in/mgo.v2"
	"net/http"
	"strings"

	"github.com/martini-contrib/binding"
	"regexp"
)

var session, _ = mgo.Dial("127.0.0.1")

func main() {
	defer session.Close()

	m := martini.New()
	m.Use(MapEncoder)
	m.Use(cors.Allow(&cors.Options{
		AllowOrigins: []string{"http://recptr.dev", "http://receptr.sonicgd.ru"},
		AllowMethods: []string{"PUT", "PATCH", "GET", "POST", "DELETE", "OPTIONS"},
		/*
		   AllowHeaders:     []string{"Origin"},
		   ExposeHeaders:    []string{"Content-Length"},
		   AllowCredentials: true,*/
	}))
	r := martini.NewRouter()
	r.Get("/", func() string {
		return "Hello! I'm Receptr"
	})
	r.Get(`/recipes`, GetRecipes)
	r.Get(`/recipes/:id`, GetRecipe)
	r.Post(`/recipes`, binding.Bind(Recipe{}), AddRecipe)
	r.Put(`/recipes/:id`, binding.Bind(Recipe{}), UpdateRecipe)
	r.Delete(`/recipes/:id`, DeleteRecipe)

	m.Action(r.Handle)
	m.Run()
}

// The regex to check for the requested format (allows an optional trailing
// slash).
var rxExt = regexp.MustCompile(`(\.(?:xml|text|json))\/?$`)

func MapEncoder(c martini.Context, w http.ResponseWriter, r *http.Request) {
	// Get the format extension
	matches := rxExt.FindStringSubmatch(r.URL.Path)
	ft := ".json"
	if len(matches) > 1 {
		// Rewrite the URL without the format extension
		l := len(r.URL.Path) - len(matches[1])
		if strings.HasSuffix(r.URL.Path, "/") {
			l--
		}
		r.URL.Path = r.URL.Path[:l]
		ft = matches[1]
	}
	// Inject the requested encoder
	switch ft {
	case ".xml":
		c.MapTo(xmlEncoder{}, (*Encoder)(nil))
		w.Header().Set("Content-Type", "application/xml")
	case ".text":
		c.MapTo(textEncoder{}, (*Encoder)(nil))
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	default:
		c.MapTo(jsonEncoder{}, (*Encoder)(nil))
		w.Header().Set("Content-Type", "application/json")
	}
}

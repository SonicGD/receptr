package main

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
)

type Recipe struct {
	ID          bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Title       string        `json:"Title"`
	Url         string        `json:"Url"`
	Picture     image         `json:"Picture"`
	Description string        `json:"Description"`
	TimeToCook  int           `json:"TimeToCook"`
	Ingredients []Ingredient  `json:"Ingredients"`
	Steps       []CookStep    `json:"Steps"`
}

func (r Recipe) all(session *mgo.Session, query bson.M) ([]Recipe, error) {
	c := session.DB("recptr").C("recepies")
	result := []Recipe{}
	err := c.Find(query).All(&result)

	return result, err
}

func (r Recipe) one(session *mgo.Session, query bson.M) (Recipe, error) {
	c := session.DB("recptr").C("recepies")
	result := Recipe{}
	err := c.Find(query).One(&result)
	return result, err
}

func (r Recipe) save(session *mgo.Session, recipe Recipe) Recipe {
	recipe.ID = bson.NewObjectId()
	c := session.DB("recptr").C("recepies")
	err := c.Insert(recipe)
	if err != nil {
		log.Fatal(err)
	}

	return recipe
}

func (r Recipe) update(session *mgo.Session, recipe Recipe) bool {
	c := session.DB("recptr").C("recepies")
	err := c.Update(bson.M{"_id": recipe.ID}, recipe)
	if err != nil {
		log.Fatal(recipe)
	}
	return true
}

func (r Recipe) delete(session *mgo.Session, recipe Recipe) bool {
	c := session.DB("recptr").C("recepies")
	err := c.Remove(bson.M{"_id": recipe.ID})
	if err != nil {
		log.Fatal(err)
	}
	return true
}

type Ingredient struct {
	Title   string `json:"Title"`
	HowMuch string `json:"HowMuch"`
}

type CookStep struct {
	Title   string `json:"Title"`
	Picture image  `json:"Picture"`
	Html    string `json:"Html"`
}

type image struct {
	Filetype string `json:"filetype"`
	Filename string `json:"filename"`
	Filesize int    `json:"filesize"`
	Base64   string `json:"base64"`
}

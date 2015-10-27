# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# Might want the categories in the seed file too?

main_categories = [
      {cat_id: 1, category_name: 'Active Life', yelp_id: 'active'},
      {cat_id: 2, category_name: 'Arts & Entertainment', yelp_id: 'arts'},
      {cat_id: 3, category_name: 'Beauty & Spas', yelp_id: 'beautysvc'},
      {cat_id: 4, category_name: 'Education', yelp_id: 'education'},
      {cat_id: 5, category_name: 'Food', yelp_id: 'food'},
      {cat_id: 6, category_name: 'Active Life', yelp_id: 'hotelstravel'},
      {cat_id: 7, category_name: 'Local Flavour', yelp_id: 'localflavour'},
      {cat_id: 8, category_name: 'Nightlife', yelp_id: 'nightlife'},
      {cat_id: 9, category_name: 'Pets', yelp_id: 'pets'},
      {cat_id: 10, category_name: 'Restaurants', yelp_id: 'restaurants'},
      {cat_id: 11, category_name: 'Shopping', yelp_id: 'shopping'},
    ]
    
main_categories.each do |mc|
  category = Category.where(cat_id: mc[:cat_id]).first_or_initialize
    category.update_attributes!(mc) 
  puts "Adding/Updated category #{mc[:category_name]} with #{mc[:cat_id]} successfully" if category.save
end


questions = [
  {id: 1, question_text: "If you were an animal, what animal would you be?", 
            a0_text: "Dog", a1_text: "Cat",
            a2_text: "Giraffe", a3_text: "Honey Badger"},
  {id: 2, question_text: "If you were a fruit, what fruit would you be?",
            a0_text: "Apple", a1_text: "Strawberry",
            a2_text: "Mango", a3_text: "Banana"},
  {id: 3, question_text: "Will you be hungry later?",
            a0_text: "Zero", a1_text: "One",
            a2_text: "Two", a3_text: "Three"},
  {id: 4, question_text: "Do you like playing sports?",
            a0_text: "Zero", a1_text: "One",
            a2_text: "Two", a3_text: "Three"},
  {id: 5, question_text: "Do you like playing video games?",
            a0_text: "Zero", a1_text: "One",
            a2_text: "Two", a3_text: "Three"},
  {id: 6, question_text: "What message should show up if you Dad calls you when you are playing a message from your answering machine",
            a0_text: "Zero", a1_text: "One",
            a2_text: "Two", a3_text: "Three"},
  {id: 7, question_text: "Hello there. How are you?",
            a0_text: "Zero", a1_text: "One",
            a2_text: "Two", a3_text: "Three"},
  {id: 8, question_text: "Do you like dancing?",
            a0_text: "Zero", a1_text: "One",
            a2_text: "Two", a3_text: "Three"},
  {id: 9, question_text: "Do you like solving puzzles?",
            a0_text: "Zero", a1_text: "One",
            a2_text: "Two", a3_text: "Three"},
  {id: 10, question_text: "Do you like buying clothes?",
            a0_text: "Zero", a1_text: "One",
            a2_text: "Two", a3_text: "Three"},
  {id: 11, question_text: "What do you want to do?",
            a0_text: "Zero", a1_text: "One",
            a2_text: "Two", a3_text: "Three"},
  {id: 12, question_text: "What type of food would you prefer?",
            a0_text: "Zero", a1_text: "One",
            a2_text: "Two", a3_text: "Three"},
  {id: 13, question_text: "What do you mean?",
            a0_text: "Zero", a1_text: "One",
            a2_text: "Two", a3_text: "Three"},
  {id: 14, question_text: "What is the meaning of life?",
            a0_text: "Zero", a1_text: "One",
            a2_text: "Two", a3_text: "Three"},
]

questions.each do |q|
  question = Question.where(id: q[:id]).first_or_initialize
  question.update_attributes!(q)
  puts "Added/Updated question #{q[:id]} successfully" if question.save
end
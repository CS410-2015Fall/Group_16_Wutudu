# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# Might want the categories in the seed file too?
UPDATE_EXISTING = true

main_categories = [
      {cat_id: 1, category_name: 'Active Life', yelp_id: 'active'},
      {cat_id: 2, category_name: 'Arts & Entertainment', yelp_id: 'arts'},
      {cat_id: 3, category_name: 'Beauty & Spas', yelp_id: 'beautysvc'},
      {cat_id: 4, category_name: 'Education', yelp_id: 'education'},
      {cat_id: 5, category_name: 'Food', yelp_id: 'food'},
      {cat_id: 6, category_name: 'Hotels & Travel', yelp_id: 'hotelstravel'},
      {cat_id: 7, category_name: 'Local Flavour', yelp_id: 'localflavour'},
      {cat_id: 8, category_name: 'Nightlife', yelp_id: 'nightlife'},
      {cat_id: 9, category_name: 'Pets', yelp_id: 'pets'},
      {cat_id: 10, category_name: 'Restaurants', yelp_id: 'restaurants'},
      {cat_id: 11, category_name: 'Shopping', yelp_id: 'shopping'},
    ]
    
main_categories.each do |mc|
  if UPDATE_EXISTING
    category = Category.where(cat_id: mc[:cat_id]).first_or_initialize
    category.update_attributes!(mc) 
    puts "Adding/Updated category #{mc[:category_name]} with #{mc[:cat_id]} successfully" if category.save
  elsif !Category.exists?(cat_id: mc[:cat_id])
    category = Category.new(cat_id: mc[:cat_id])
    category.update_attributes!(mc)
    puts "Adding category #{mc[:category_name]} with #{mc[:cat_id]} successfully" if category.save
  end
end


questions = [
  {id: 1, question_text: "If life were to give you lemons, what would you do?", 
            a0_text: "Throw them", a1_text: "Make lemonade",
            a2_text: "Eat them", a3_text: "Sell them"},
  {id: 2, question_text: "On a nice day, what would you rather do?",
            a0_text: "Go for a jog", a1_text: "Eat a nice sandwich",
            a2_text: "Hide from sun", a3_text: "Visit an Art Gallery"},
  {id: 3, question_text: "How much can you eat?",
            a0_text: "A fly", a1_text: "A pea",
            a2_text: "A kappa", a3_text: "A horse"},
  {id: 4, question_text: "In a group of friends, would you rather",
            a0_text: "Go drinking", a1_text: "Eat out",
            a2_text: "Play sports", a3_text: "Watch a movie"},
  {id: 5, question_text: "What’s the meaning of life?",
            a0_text: "42", a1_text: "Eat an entire pizza",
            a2_text: "DANK MEMES", a3_text: "$$$"},
  {id: 6, question_text: "Which is your favourite?",
            a0_text: "Video Games", a1_text: "Clubbing",
            a2_text: "Eating", a3_text: "CPSC 410"},
  {id: 7, question_text: "Song name??",
            a0_text: "Darude Sandstorm", a1_text: "Friday",
            a2_text: "Never gonna give you up", a3_text: "23"},
  {id: 8, question_text: "Do you like buying clothes?",
            a0_text: "Yes", a1_text: "No",
            a2_text: "Only if on sale", a3_text: "Sometimes"},
  {id: 9, question_text: "Favourite superpower?",
            a0_text: "Unlimited eating", a1_text: "Flying",
            a2_text: "Invisibility", a3_text: "Deciding what to do"},
  {id: 10, question_text: "What is kappa? kappa",
            a0_text: "ForsenBOYS", a1_text: "TUCK FRUMP",
            a2_text: "10th Greek letter", a3_text: "Curvature"},
  {id: 11, question_text: "Which phrase best describes you?",
            a0_text: "Hungry", a1_text: "Very hungry",
            a2_text: "GIFF FOOD", a3_text: "Chocolate? CHOCOLATE?"},
  {id: 12, question_text: "Press 4 if you are not a bot.",
            a0_text: "1", a1_text: "2",
            a2_text: "3", a3_text: "4"},
  {id: 13, question_text: "What do you want to study?",
            a0_text: "Basket Weaving", a1_text: "Computer Science",
            a2_text: "Culinary Arts", a3_text: "Chemistry"},
  {id: 14, question_text: "Which animal best describes you?",
            a0_text: "Pig", a1_text: "Dog",
            a2_text: "Cat", a3_text: "Cow"},
  {id: 15, question_text: "Best app?",
            a0_text: "Wutudu", a1_text: "Wutudu",
            a2_text: "Wutudu", a3_text: "Wutudu"},
]

answer_weights = {
  1 => {
    0 => [{category: 1, weight: 10}, {category: 3, weight: 100}],
    1 => [{category: 5, weight: 1000}],
    2 => [{category: 5, weight: 1000}],
    3 => [{category: 11, weight: 100}],
    }, 
  2 => {
    0 => [{category: 1, weight: 10}],
    1 => [{category: 5, weight: 1000}],
    2 => [{category: 8, weight: 10}],
    3 => [{category: 2, weight: 100}],
    }, 
  3 => {
    0 => [{category: 5, weight: 1}],
    1 => [{category: 5, weight: 100}],
    2 => [{category: 5, weight: 1000}],
    3 => [{category: 5, weight: 10000}],
    }, 
  4 => {
    0 => [{category: 5, weight: 100}, {category: 10, weight: 1000}],
    1 => [{category: 5, weight: 1000}, {category: 10, weight: 100}],
    2 => [{category: 1, weight: 10}],
    3 => [{category: 2, weight: 10}],
    }, 
  5 => {
    0 => [{category: 2, weight: 10}],
    1 => [{category: 5, weight: 1000}],
    2 => [{category: 3, weight: 100}],
    3 => [{category: 11, weight: 100}],
    }, 
  6 => {
    0 => [{category: 2, weight: 10}],
    1 => [{category: 8, weight: 10}],
    2 => [{category: 5, weight: 1000}, {category: 10, weight: 1000}],
    3 => [{category: 4, weight: 100}],
    }, 
  7 => {
    0 => [{category: 5, weight: 1}],
    1 => [{category: 8, weight: 1}],
    2 => [{category: 5, weight: 1}, {category: 10, weight: 1}],
    3 => [{category: 3, weight: 1}, {category: 4, weight: -1}],
    }, 
  8 => {
    0 => [{category: 11, weight: 10}],
    1 => [{category: 11, weight: -10}],
    2 => [{category: 11, weight: 3}],
    3 => [{category: 11, weight: 5}],
    }, 
  9 => {
    0 => [{category: 5, weight: 1000}, {category: 10, weight: 100}],
    1 => [{category: 6, weight: 100}],
    2 => [{category: 2, weight: 100}],
    3 => [{category: 1, weight: 100}],
    }, 
  10 => {
    0 => [{category: 1, weight: 0}],
    1 => [{category: 1, weight: 0}],
    2 => [{category: 1, weight: 0}],
    3 => [{category: 1, weight: 0}],
    }, 
  11 => {
    0 => [{category: 5, weight: 10}],
    1 => [{category: 5, weight: 100}],
    2 => [{category: 5, weight: 1000}],
    3 => [{category: 5, weight: 10000}],
    }, 
  12 => {
    0 => [{category: 5, weight: 0}],
    1 => [{category: 5, weight: 0}],
    2 => [{category: 5, weight: 0}],
    3 => [{category: 5, weight: 1000}],
    }, 
  13 => {
    0 => [{category: 2, weight: 10}],
    1 => [{category: 4, weight: 1}],
    2 => [{category: 5, weight: 1000}, {category: 10, weight: 100}],
    3 => [{category: 4, weight: 10}],
    }, 
  14 => {
    0 => [{category: 5, weight: 1000}],
    1 => [{category: 1, weight: 10}],
    2 => [{category: 9, weight: 10}],
    3 => [{category: 5, weight: 1000}],
    }, 
  15 => {
    0 => [{category: 5, weight: 1000}],
    1 => [{category: 5, weight: 1000}],
    2 => [{category: 5, weight: 1000}],
    3 => [{category: 5, weight: 1000}],
    }, 
}

questions.each do |q|
  if UPDATE_EXISTING
    # Add answers
    question = Question.where(id: q[:id]).first_or_initialize
    question.answer_weights.destroy_all unless question.answer_weights.nil?
    question.update_attributes!(q)
    (0..3).each do |i|
      answer_weights[q[:id]][i].each do |aw|
        question.answer_weights.build(anum: i, category_id: aw[:category], weight: aw[:weight])
      end
    end
    puts "Added/Updated question #{q[:id]} successfully" if question.save
  elsif !Question.exists?(id: q[:id])
    question = Question.new(q)
    # should be answer_weights[q[:id]], but hardcoding sample weights for now
    (0..3).each do |i|
      answer_weights[1][i].each do |aw|
        question.answer_weights.build(anum: i, category_id: aw[:category], weight: aw[:weight])
      end
    end
    puts "Added question #{q[:id]} successfully" if question.save
  end
end
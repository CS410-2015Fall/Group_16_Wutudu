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
  {id: 1, question_text: "On a nice day, you will:",
            a0_text: "Go for a jog", a1_text: "Eat a sandwich",
            a2_text: "Go to the spa", a3_text: "Visit an Art Gallery"},
  {id: 2, question_text: "In a group of friends, would you rather:",
            a0_text: "Go drinking", a1_text: "Eat out",
            a2_text: "Play sports", a3_text: "Shopping"},
  {id: 3, question_text: "Which word best describes you?",
            a0_text: "Hungry", a1_text: "Outgoing",
            a2_text: "Sleepy", a3_text: "Hardworking"},
  {id: 4, question_text: "Which best describes your budget",
            a0_text: "An empty wallet", a1_text: "Burger flipper",
            a2_text: "Software Developer", a3_text: "Bill Gates"},
  {id: 5, question_text: "How many hours will you be free?",
            a0_text: "One", a1_text: "Two",
            a2_text: "Three", a3_text: "Four"},
  {id: 6, question_text: "Which activity do you like the least?",
            a0_text: "Studying", a1_text: "Shopping",
            a2_text: "Singing", a3_text: "Sports"},
  {id: 7, question_text: "Which would you rather study?",
            a0_text: "Fashion", a1_text: "Business",
            a2_text: "Culinary Arts", a3_text: "Computer Science"},
  {id: 8, question_text: "What type of activity do you prefer?",
            a0_text: "Indoors", a1_text: "Outdoors",
            a2_text: "Between doors", a3_text: "None of the above"},
  {id: 9, question_text: "Favourite superpower?",
            a0_text: "Unlimited eating", a1_text: "Flying",
            a2_text: "Invisibility", a3_text: "Teleportation"},
  {id: 10, question_text: "Which item can you not live without?",
            a0_text: "Food", a1_text: "Clothes",
            a2_text: "Money", a3_text: "Computers"},
  {id: 11, question_text: "What do you want to do?",
            a0_text: "Eat", a1_text: "Go shopping",
            a2_text: "Play games", a3_text: "Decide what to do"},
  {id: 12, question_text: "Will you be hungry?",
            a0_text: "Very hungry", a1_text: "hungry",
            a2_text: "Not very hungry", a3_text: "Maybe hungry"},
  {id: 13, question_text: "How far are you willing to travel?",
            a0_text: "No travelling", a1_text: "Walking distance",
            a2_text: "Biking distance", a3_text: "Driving distance"},
  {id: 14, question_text: "What do you do to procrastinate?",
            a0_text: "Watch videos", a1_text: "Play cards",
            a2_text: "Listen to music", a3_text: "Play video games"},
  {id: 15, question_text: "On a bad day, you will?",
            a0_text: "See a movie", a1_text: "Eat",
            a2_text: "Play sports", a3_text: "Spend money"},
  {id: 16, question_text: "Which best describes your personality?",
            a0_text: "Outgoing", a1_text: "Active",
            a2_text: "Creative", a3_text: "Shy"},
  {id: 17, question_text: "Favourite time of day?",
            a0_text: "Morning", a1_text: "Noon",
            a2_text: "Afternoon", a3_text: "Midnight"},
  {id: 18, question_text: "What life skills would you like to learn?",
            a0_text: "Cook a proper meal", a1_text: "Wine Tasting",
            a2_text: "Run 10 Miles", a3_text: "Party All Night"},
  {id: 19, question_text: "Which best describes your personality?",
            a0_text: "Watching movies", a1_text: "Playing games",
            a2_text: "Playing sports", a3_text: "Going shopping"},
  {id: 20, question_text: "Dream job?",
            a0_text: "Chef", a1_text: "Athlete",
            a2_text: "Designer", a3_text: "Programmer"},
]

answer_weights = {
  1 => {
    0 => [{category: 1, weight: 4}, {category: 6, weight: 2},  {category: 9, weight: 1}, {category: 5, weight: 2}, {category: 10, weight: 2}],
    1 => [{category: 5, weight: 4}, {category: 10, weight: 4}, {category: 2, weight: 3}, {category: 1, weight: -2}],
    2 => [{category: 3, weight: 5}, {category: 8, weight: 1}],
    3 => [{category: 2, weight: 5}, {category: 6, weight: 1}, {category: 11, weight: 1}],
    },
  2 => {
    0 => [{category: 5, weight: 2}, {category: 8, weight: 5}, {category: 10, weight: 3},  {category: 2, weight: 3}, {category: 1, weight: -3}],
    1 => [{category: 5, weight: 4}, {category: 10, weight: 5}, {category: 8, weight: 1}, {category: 7, weight: 3}],
    2 => [{category: 1, weight: 5}, {category: 9, weight: 3},],
    3 => [{category: 1, weight: 5}, {category: 2, weight: 4}, {category: 6, weight: 1}],
    },
  3 => {
    0 => [{category: 5, weight: 3}, {category: 10, weight: 1}, {category: 1, weight: -2}],
    1 => [{category: 1, weight: 3}, {category: 8, weight: 4}, {category: 5, weight: 2}, {category: 5, weight: 3}, {category: 11, weight: 2}],
    2 => [{category: 3, weight: 3}, {category: 9, weight: 2}, {category: 8, weight: -3}],
    3 => [{category: 4, weight: 3}, {category: 3, weight: -2}],
    },
  4 => {
    0 => [{category: 1, weight: -5}, {category: 5, weight: -5}, {category: 10, weight: -5}, {category: 11, weight: -5}],
    1 => [{category: 1, weight: 2}, {category: 7, weight: 2}, {category: 4, weight: 4}],
    2 => [{category: 1, weight: 2}, {category: 5, weight: 2}, {category: 10, weight: 2}, {category: 11, weight: 2}],
    3 => [{category: 1, weight: 3}, {category: 4, weight: 2}, {category: 6, weight: 2}, {category: 11, weight: 3}],
    },
  5 => {
    0 => [{category: 1, weight: 0}],
    1 => [{category: 1, weight: 0}],
    2 => [{category: 1, weight: 0}],
    3 => [{category: 1, weight: 0}],
    },
  6 => {
    0 => [{category: 4, weight: -3}],
    1 => [{category: 11, weight: -4}],
    2 => [{category: 2, weight: -2}],
    3 => [{category: 1, weight: -4}],
    },
  7 => {
    0 => [{category: 3, weight: 3}, {category: 7, weight: 1}, {category: 11, weight: 3}],
    1 => [{category: 2, weight: 3}, {category: 6, weight: 2}, {category: 11, weight: 3}],
    2 => [{category: 5, weight: 5}, {category: 10, weight: 3}],
    3 => [{category: 1, weight: 1}, {category: 4, weight: 1}, {category: 10, weight: 2}],
    },
  8 => {
    0 => [{category: 1, weight: -3}, {category: 3, weight: 1}, {category: 8, weight: 2}, {category: 10, weight: 2}, {category: 11, weight: 2}],
    1 => [{category: 1, weight: 3}, {category: 9, weight: 1}],
    2 => [{category: 1, weight: 0}],
    3 => [{category: 1, weight: -2}, {category: 3, weight: -2}, {category: 8, weight: -2}, {category: 11, weight: -2}],
    },
  9 => {
    0 => [{category: 5, weight: 5}, {category: 10, weight: 5}],
    1 => [{category: 1, weight: 3}, {category: 6, weight: 3}],
    2 => [{category: 2, weight: 5}],
    3 => [{category: 11, weight: 2}, {category: 8, weight: 3}, {category: 2, weight: 3}],
    },
  10 => {
    0 => [{category: 5, weight: 3}, {category: 10, weight: 3}],
    1 => [{category: 11, weight: 3}, {category: 3, weight: 2}],
    2 => [{category: 11, weight: 3}, {category: 10, weight: 3}, {category: 6, weight: 3}],
    3 => [{category: 2, weight: 2}, {category: 1, weight: 1}],
    },
  11 => {
    0 => [{category: 5, weight: 5}],
    1 => [{category: 11, weight: 5}],
    2 => [{category: 1, weight: 3}, {category: 2, weight: 5}],
    3 => [{category: 1, weight: 0}],
    },
  12 => {
    0 => [{category: 5, weight: 5}],
    1 => [{category: 5, weight: 2}],
    2 => [{category: 5, weight: -2}],
    3 => [{category: 5, weight: -5}],
    },
  13 => {
    0 => [{category: 6, weight: -5}],
    1 => [{category: 6, weight: -2}],
    2 => [{category: 6, weight: -1}],
    3 => [{category: 6, weight: 0}],
    },
  14 => {
    0 => [{category: 2, weight: 3}, {category: 1, weight: -3}],
    1 => [{category: 2, weight: 3}, {category: 1, weight: -5}],
    2 => [{category: 2, weight: 3}, {category: 8, weight: 3}],
    3 => [{category: 2, weight: 3}],
    },
  15 => {
    0 => [{category: 2, weight: 3}, {category: 1, weight: -3}],
    1 => [{category: 5, weight: 3}],
    2 => [{category: 1, weight: 3}],
    3 => [{category: 11, weight: 4}],
    },
  16 => {
    0 => [{category: 1, weight: 3}],
    1 => [{category: 1, weight: 3}],
    2 => [{category: 2, weight: 4}],
    3 => [{category: 1, weight: -3}],
    },
  17 => {
    0 => [{category: 8, weight: -5}],
    1 => [{category: 1, weight: 3}],
    2 => [{category: 1, weight: 3}],
    3 => [{category: 8, weight: 5}],
    },
  18 => {
    0 => [{category: 5, weight: 3}],
    1 => [{category: 5, weight: 3}, {category: 2, weight: 3}],
    2 => [{category: 1, weight: 5}],
    3 => [{category: 8, weight: 5}],
    },
  19 => {
    0 => [{category: 2, weight: 3}],
    1 => [{category: 2, weight: 1}],
    2 => [{category: 1, weight: 3}, {category: 2, weight: 3}],
    3 => [{category: 11, weight: 5}],
    },
  20 => {
    0 => [{category: 5, weight: 4}],
    1 => [{category: 1, weight: 4}],
    2 => [{category: 3, weight: 4}],
    3 => [{category: 4, weight: 1}],
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
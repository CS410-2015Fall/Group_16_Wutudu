# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151101055014) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "answer_weights", force: :cascade do |t|
    t.integer "anum"
    t.integer "weight"
    t.integer "question_id"
    t.integer "category_id"
  end

  add_index "answer_weights", ["category_id"], name: "index_answer_weights_on_category_id", using: :btree
  add_index "answer_weights", ["question_id"], name: "index_answer_weights_on_question_id", using: :btree

  create_table "categories", force: :cascade do |t|
    t.string  "category_name"
    t.string  "yelp_id"
    t.integer "cat_id"
  end

  add_index "categories", ["cat_id"], name: "index_categories_on_cat_id", using: :btree
  add_index "categories", ["yelp_id"], name: "index_categories_on_yelp_id", using: :btree

  create_table "friendships", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "friend_id"
    t.boolean  "approved"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "group_users", force: :cascade do |t|
    t.integer  "group_id"
    t.integer  "user_id"
    t.boolean  "approved"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "group_users", ["group_id"], name: "index_group_users_on_group_id", using: :btree
  add_index "group_users", ["user_id"], name: "index_group_users_on_user_id", using: :btree

  create_table "groups", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groups_users", id: false, force: :cascade do |t|
    t.integer "user_id",  null: false
    t.integer "group_id", null: false
  end

  create_table "pre_wutudu_questions", force: :cascade do |t|
    t.integer  "qnum"
    t.integer  "question_id"
    t.integer  "pre_wutudu_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "pre_wutudu_questions", ["pre_wutudu_id"], name: "index_pre_wutudu_questions_on_pre_wutudu_id", using: :btree
  add_index "pre_wutudu_questions", ["qnum"], name: "index_pre_wutudu_questions_on_qnum", using: :btree
  add_index "pre_wutudu_questions", ["question_id"], name: "index_pre_wutudu_questions_on_question_id", using: :btree

  create_table "pre_wutudus", force: :cascade do |t|
    t.datetime "event_date"
    t.decimal  "latitude"
    t.decimal  "longitude"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "group_id"
    t.boolean  "finished"
  end

  add_index "pre_wutudus", ["group_id"], name: "index_pre_wutudus_on_group_id", using: :btree

  create_table "questions", force: :cascade do |t|
    t.text "question_text"
    t.text "a0_text"
    t.text "a1_text"
    t.text "a2_text"
    t.text "a3_text"
  end

  create_table "user_answers", force: :cascade do |t|
    t.integer "user_id"
    t.integer "pre_wutudu_id"
    t.text    "answers"
    t.boolean "declined"
  end

  add_index "user_answers", ["pre_wutudu_id"], name: "index_user_answers_on_pre_wutudu_id", using: :btree
  add_index "user_answers", ["user_id"], name: "index_user_answers_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "email",        null: false
    t.string   "password"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "api_key"
    t.string   "device_token"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree

  create_table "wutudu_events", force: :cascade do |t|
    t.string   "activity_name"
    t.integer  "category_id"
    t.datetime "event_time"
    t.decimal  "latitude"
    t.decimal  "longitude"
    t.integer  "group_id"
    t.integer  "pre_wutudu_id"
    t.string   "event_details"
  end

  add_index "wutudu_events", ["category_id"], name: "index_wutudu_events_on_category_id", using: :btree
  add_index "wutudu_events", ["group_id"], name: "index_wutudu_events_on_group_id", using: :btree
  add_index "wutudu_events", ["pre_wutudu_id"], name: "index_wutudu_events_on_pre_wutudu_id", using: :btree

  add_foreign_key "answer_weights", "categories"
  add_foreign_key "answer_weights", "questions"
  add_foreign_key "group_users", "groups"
  add_foreign_key "group_users", "users"
  add_foreign_key "pre_wutudu_questions", "pre_wutudus"
  add_foreign_key "pre_wutudu_questions", "questions"
  add_foreign_key "pre_wutudus", "groups"
  add_foreign_key "user_answers", "pre_wutudus"
  add_foreign_key "user_answers", "users"
  add_foreign_key "wutudu_events", "categories"
  add_foreign_key "wutudu_events", "groups"
  add_foreign_key "wutudu_events", "pre_wutudus"
end

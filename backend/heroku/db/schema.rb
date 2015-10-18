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

ActiveRecord::Schema.define(version: 20151017071724) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "categories", force: :cascade do |t|
    t.string "category_name"
  end

  create_table "groups", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groups_users", id: false, force: :cascade do |t|
    t.integer "user_id",  null: false
    t.integer "group_id", null: false
  end

  create_table "pre_wutudus", force: :cascade do |t|
    t.datetime "event_date"
    t.decimal  "latitude"
    t.decimal  "longitude"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "group_id"
  end

  add_index "pre_wutudus", ["group_id"], name: "index_pre_wutudus_on_group_id", using: :btree

  create_table "questions", force: :cascade do |t|
    t.integer "qnum"
    t.text    "question"
  end

  create_table "user_answers", force: :cascade do |t|
    t.integer "user_id"
    t.integer "pre_wutudu_id"
    t.integer "a0"
    t.integer "a1"
    t.integer "a2"
    t.integer "a3"
    t.integer "a4"
    t.integer "a5"
    t.integer "a6"
    t.integer "a7"
    t.integer "a8"
    t.integer "a9"
  end

  add_index "user_answers", ["pre_wutudu_id"], name: "index_user_answers_on_pre_wutudu_id", using: :btree
  add_index "user_answers", ["user_id"], name: "index_user_answers_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "email",      null: false
    t.string   "password"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "api_key"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree

  create_table "widgets", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "stock"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_foreign_key "pre_wutudus", "groups"
  add_foreign_key "user_answers", "pre_wutudus"
  add_foreign_key "user_answers", "users"
end

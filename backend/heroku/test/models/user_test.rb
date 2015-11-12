require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def setup
    @name = generate_random_string(10)
    @pswd = generate_random_string(50)
    @email = 'test@test.com'
    @empty_str = ''
    @user = User.new(name: @name, password: @pswd, email: @email)
  end

  def teardown
    @user = nil
  end

  test 'should correctly validate valid user' do
    assert @user.valid?
  end

  # nil params
  test 'should have email' do
    @user.email = nil
    assert_not @user.valid?
  end

  test 'should have name' do
    @user.name = nil
    assert_not @user.valid?
  end

  test 'should have password' do
    @user.password = nil
    assert_not @user.valid?
  end

  # Blank params
  test 'should not have blank email' do
    @user.email = @empty_str
    assert_not @user.valid?
  end

  test 'should not have blank name' do
    @user.name = @empty_str
    assert_not @user.valid?
  end

  test 'should not have blank password' do
    @user.password = @empty_str
    assert_not @user.valid?
  end

  # long params
  test 'should not have long email' do
    @user.email = 'a' * 50 << '@test.com'
    assert_not @user.valid?
  end

  test 'should not have long name' do
    @user.name = 'a' * 51
    assert_not @user.valid?
  end

  # Malformed email
  test 'should not have malformed email' do
    @user.email = 'test'
    assert_not @user.valid?
  end
end

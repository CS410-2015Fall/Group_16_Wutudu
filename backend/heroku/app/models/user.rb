require 'bcrypt'
class User < ActiveRecord::Base
  include BCrypt
  before_create :generate_new_api_key, :hash_password

  def bcrypt_password
    BCrypt::Password.new(self.password)
  end

  def basic_info
    {id: self.id, email: self.email, name: self.name}
  end

  def renew_api_key
    generate_new_api_key
    self.save
  end

  private

  # generate api key upon creation
  def generate_new_api_key
    begin
      token = SecureRandom.base64.tr('+/=', 'Qrt')
    end until !User.exists?(api_key: token)
    self.api_key = token
  end

  def hash_password
    self.password = BCrypt::Password.create(self.password)
  end
end

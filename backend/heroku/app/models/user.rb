require 'bcrypt'
class User < ActiveRecord::Base
  include BCrypt
  before_create :generate_api_key, :hash_password

  def bcrypt_password
    BCrypt::Password.new(self.password)
  end

  private

  # generate api key upon creation
  def generate_api_key
    token = SecureRandom.base64.tr('+/=', 'Qrt')
    unless User.exists?(api_key: token)
      self.api_key = token
    end
  end

  def hash_password
    self.password = BCrypt::Password.create(self.password)
  end
end

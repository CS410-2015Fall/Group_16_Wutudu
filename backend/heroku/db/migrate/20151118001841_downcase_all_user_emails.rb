class DowncaseAllUserEmails < ActiveRecord::Migration
  def change
    User.all.each do |user|
      user.update_attributes :email => user.email.downcase
    end
  end
end

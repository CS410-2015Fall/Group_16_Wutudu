class GroupsController < ApiController
  before_action :authenticate

  def show
    render json: {
                   groups: {active_groups: @user.active_groups.collect{|g| g.basic_info},
                           pending_groups: @user.pending_groups.collect{|g| g.basic_info}}
                  }, status: 200
  end

  def create
    group = Group.new(name: group_params[:name])
    return send_errors("Failed To Create Group", 400) unless group.save

    gu = group.group_users.build(user_id: @user.id, approved: true)
    if gu.save
      return send_success({group_id: group.id, message: "Group Created"}) if group_params[:emails].nil?
      message, code = add_users_to_group(group.id, group_params[:emails])
      return (code == 200 ? send_success(message) : send_errors(message, code))
    else
      group.destroy
      render json: {errors: "Failed To Create Group and Add User"}, status: 400
    end
  end

  private
  def group_params
    params.require(:group).permit(:name, :id, :emails => [])
  end

  def add_users_to_group(gid, emails)
    group = Group.find_by_id(gid)
    return "Group Not Found", 404 unless group
    size_counter = emails.length
    emails.each do |e|
      user = User.find_by_email(e)
      if !user
        size_counter -= 1
        next
      end

      g_users = group.group_users
      user_in_group = g_users.where(user_id: user.id).first
      if user_in_group
        size_counter -= 1
        next
      else
        g_user_new = g_users.build(user_id: user.id, approved: false)
        if !g_user_new.save
          size_counter -= 1
          next
        end
      end
    end

    if size_counter == 0
      return "No Users Were Invited", 400
    elsif size_counter < emails.length
      return "Failed To Invite At Least One User", 400
    else
      return {group_id: group.id, message: "All Users Invited"}, 200
    end
  end
end

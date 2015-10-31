class GroupsController < ApiController
  before_action :authenticate

  def show
    message =  {
                 groups: {
                           active_groups: @user.active_groups.collect{|g| g.basic_info},
                           pending_groups: @user.pending_groups.collect{|g| g.basic_info}
                         }
               }
    return send_success(message)
  end

  def create
    group = Group.new(name: group_params[:name])
    return send_errors("Failed To Create Group", 400) unless group.save

    gu = group.group_users.build(user_id: @user.id, approved: true)
    if gu.save
      return send_success({group: group.basic_info, message: "Group Created"}) if group_params[:emails].nil?
      message, code = add_users_to_group(group.id, group_params[:emails])
      return send_errors(message, code) unless code == 200
      send_pending_users_notifications(group)
      return send_success(message)
    else
      group.destroy
      render json: {errors: "Failed To Create Group and Add User"}, status: 400
    end
  end

  private

  def params_for_create
  end

  def group_params
    gp = params.require(:group).permit(:name, :emails => [])
    gp.require(:name)
    return gp
  end

  def send_pending_users_notifications(group)
    payload = {
      group: group.basic_info
    }
    send_notification(@group.pending_users_device_tokens, \
                      "You have been invited to join Group #{group.name}", \
                      payload)
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
      return {group: group.basic_info, message: "All Users Invited"}, 200
    end
  end
end

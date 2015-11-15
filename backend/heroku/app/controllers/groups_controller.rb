class GroupsController < ApiController
  before_action :authenticate

  def show
    message =  {
                 groups: {
                           active_groups: @user.active_groups.collect{|g| g.basic_info},
                           pending_groups: @user.pending_groups.collect{|g| g.basic_info}
                         }
               }
    render success_msg(message) and return
  end

  def create
    group = Group.new(name: group_params[:name])
    render errors_msg("Failed To Create Group", 400) and return \
      unless group.save

    gu = group.group_users.build(user_id: @user.id, approved: true)
    if gu.save
      render success_msg({group: group.basic_info, message: "Group Created"}) and return \
        if group_params[:emails].nil?
      # Even if adding other users failed, it should still be considered as a success
      message, code, added_users = group.add_users_to_group(group_params[:emails])
      send_users_notifications(group, added_users)
      message = {group: group.basic_info, message: message} unless code == 200
      message[:message] = '' << 'New Group Created And ' << message[:message]
      render success_msg(message) and return
    else
      group.destroy
      render errors_msg("Failed To Create Group and Add User", 400) and return
    end
  end

  private

  def group_params
    gp = params.require(:group).permit(:name, :emails => [])
    gp.require(:name)
    gp
  end

  def send_users_notifications(group, users)
    device_tokens = users.collect{|u| u.device_token}.compact
    unless device_tokens.empty?
      payload = {
        group: group.basic_info,
        state: 'group'
      }
      send_notification(device_tokens, \
                        "You have been invited to join Group #{group.name}", \
                        payload)
    end
  end
end

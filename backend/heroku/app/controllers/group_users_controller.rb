class GroupUsersController < GroupsController
  before_action :authenticate, :client_in_group

  def create
    message, code, added_users = @group.add_users_to_group(group_user_params[:emails])
    render errors_msg(message, code) and return \
      unless code == 200
    send_users_notifications(@group, added_users)
    render success_msg(message) and return
  end

  def update
    render errors_msg("Already In Group", 400) and return \
      if @g_user.approved

    @g_user.approved = true
    render errors_msg("Failed To Join Group", 400) and return \
      unless @g_user.save
    render success_msg({group: @group.basic_info, message: "Group Joined"}) and return
  end

  def destroy
    approved = @g_user.approved
    @g_user.destroy
    render success_msg({group: @group.basic_info, message: "Request Declined"}) and return \
      unless approved
    render success_msg({group: @group.basic_info, message: "Left Group"}) and return
  end

  private
  def group_user_params
    g_u = params.require(:group_user).permit(emails: [])
    g_u.require(:emails)
    g_u
  end

  # Check if requester is in group
  def client_in_group
    @group = @user.groups.find_by_id(params[:gid])
    render errors_msg("Not In Group", 404) and return \
      unless @group
    @g_user = GroupUser.where(group_id: @group.id, user_id: @user.id).first
  end

  def check_pending(id)
    @user.pending_groups.find_by_id(id).first
  end
end

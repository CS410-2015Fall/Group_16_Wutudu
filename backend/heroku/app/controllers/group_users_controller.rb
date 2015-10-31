class GroupUsersController < GroupsController
  before_action :authenticate, :client_in_group

  def show
    # get rid
    all_users = {
                  group_users: @group.group_users_info
                }
    return send_success(all_users)
  end

  def create
    message, code = add_users_to_group(@group.id, group_user_params[:emails])
    return send_errors(message, code) unless code == 200
    send_pending_users_notifications(@group)
    return send_success(message)
  end

  def update
    return send_errors("Already In Group", 400) if @g_user.approved

    @g_user.approved = true
    return send_errors("Failed To Join Group", 400) unless @g_user.save
    return send_success({group: @group.basic_info, message: "Group Joined"})
  end

  def destroy
    approved = @g_user.approved
    @g_user.destroy
    return send_success({group: @group.basic_info, message: "Request Declined"}) unless approved
    return send_success({group: @group.basic_info, message: "Left Group"})
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
    return send_errors("Not In Group", 404) unless @group
    @g_user = GroupUser.where(group_id: @group.id, user_id: @user.id).first
  end

  def check_pending(id)
    @user.pending_groups.find_by_id(id).first
  end
end

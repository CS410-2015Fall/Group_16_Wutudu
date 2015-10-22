class GroupUsersController < GroupsController
  before_action :authenticate, :client_in_group

  def show
    # get rid
    all_users = {
                  group_users:
                    {
                      active_users: @group.active_users.collect {|u| u.basic_info},
                      pending_users: @group.pending_users.collect {|u| u.basic_info}
                    }
                }
    return send_success(all_users)
  end

  def create
    message, code = add_users_to_group(@group.id, group_user_params[:emails])
    return (code == 200 ? send_success(message) : send_errors(message, code))
  end

  def update
    return send_errors("Already In Group", 400) if @g_user.approved

    @g_user.approved = true
    return send_errors("Failed To Join Group", 400) unless @g_user.save
    return send_success({message: "Group Joined"}) 
  end

  def destroy
    approved = @g_user.approved
    @g_user.destroy
    return send_success({mssage: "Request Declined"}) unless approved
    return send_success({mssage: "Left Group"})
  end

  private
  def group_user_params
    g_u = params.require(:group_user).permit(emails: [])
    g_u.require(:emails)
    g_u
  end

  # Check if requester is in group
  def client_in_group
    @group = @user.groups.find_by_id(params[:id])
    unless @group
      return send_errors("Not In Group", 404)
    else
      @g_user = GroupUser.where(group_id: @group.id, user_id: @user.id).first
    end
  end

  def check_pending(id)
    @user.pending_groups.find_by_id(id).first
  end
end

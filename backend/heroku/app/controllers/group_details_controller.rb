class GroupDetailsController < ApiController
  before_action :authenticate, :client_in_group

  # Show all the information for a given group id, and user
  def show
    render success_msg(@group.all_info_per_user(@user.id)) and return
  end

  private
  # Check if requester is in group
  def client_in_group
    @group = @user.groups.find_by_id(params[:gid])
    render errors_msg("User Not In Group", 404) and return \
      unless @group
  end
end
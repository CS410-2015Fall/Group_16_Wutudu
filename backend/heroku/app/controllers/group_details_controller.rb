class GroupDetailsController < ApiController
  before_action :authenticate, :client_in_group

  # Show all the information for a given group id
  def show
    return send_success(@group.all_info)
  end

  private
  # Check if requester is in group
  def client_in_group
    @group = @user.groups.find_by_id(params[:gid])
    return send_errors("User Not In Group", 404) unless @group
  end
end
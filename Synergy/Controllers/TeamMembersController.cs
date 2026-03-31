using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Synergy.Data;
using Synergy.Models;

namespace Synergy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamMembersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeamMembersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeamMember>>> GetTeamMembers()
        {
            var teamMembers = await _context.TeamMembers
                .Include(tm => tm.User)
                .Include(tm => tm.Team)
                .ToListAsync();

            return Ok(teamMembers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TeamMember>> GetTeamMember(int id)
        {
            var teamMember = await _context.TeamMembers
                .Include(tm => tm.User)
                .Include(tm => tm.Team)
                .FirstOrDefaultAsync(tm => tm.Id == id);

            if (teamMember == null)
                return NotFound();

            return Ok(teamMember);
        }

        [HttpPost]
        public async Task<ActionResult<TeamMember>> CreateTeamMember(TeamMember teamMember)
        {
            var exists = await _context.TeamMembers.AnyAsync(tm =>
                tm.UserId == teamMember.UserId && tm.TeamId == teamMember.TeamId);

            if (exists)
                return BadRequest("This user is already in that team.");

            _context.TeamMembers.Add(teamMember);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTeamMember), new { id = teamMember.Id }, teamMember);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeamMember(int id)
        {
            var teamMember = await _context.TeamMembers.FindAsync(id);

            if (teamMember == null)
                return NotFound();

            _context.TeamMembers.Remove(teamMember);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
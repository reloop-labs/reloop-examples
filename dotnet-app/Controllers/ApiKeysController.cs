using Microsoft.AspNetCore.Mvc;
using Reloop;
using Reloop.Models;

namespace DotnetApp.Controllers
{
    [ApiController]
    [Route("api/api-keys")]
    public class ApiKeysController : ControllerBase
    {
        private readonly ReloopClient _client;

        public ApiKeysController(ReloopClient client)
        {
            _client = client;
        }

        public record CreateKeyDto(string Name);
        public record UpdateKeyDto(string Name);

        // 1. POST /api/api-keys - Create API Key
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateKeyDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest(new { success = false, error = "Name is required" });

            try
            {
                var result = await _client.ApiKeys.CreateAsync(new CreateApiKeyParams(dto.Name, true, true));
                return StatusCode(201, new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        // 2. GET /api/api-keys - List API Keys
        [HttpGet]
        public async Task<IActionResult> List([FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            try
            {
                var paramsObj = new ApiKeyListParams { Page = page, Limit = limit };
                var result = await _client.ApiKeys.ListAsync(paramsObj);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        // 3. GET /api/api-keys/{id} - Get Key Details
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            try
            {
                var result = await _client.ApiKeys.GetAsync(id);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        // 4. PATCH /api/api-keys/{id} - Update / Rename Key
        [HttpPatch("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateKeyDto dto)
        {
            try
            {
                var result = await _client.ApiKeys.UpdateAsync(id, new UpdateApiKeyParams(dto.Name, true));
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        // 5. POST /api/api-keys/{id}/disable - Disable Key
        [HttpPost("{id}/disable")]
        public async Task<IActionResult> Disable(string id)
        {
            try
            {
                var result = await _client.ApiKeys.DisableAsync(id);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        // 6. POST /api/api-keys/{id}/enable - Enable Key
        [HttpPost("{id}/enable")]
        public async Task<IActionResult> Enable(string id)
        {
            try
            {
                var result = await _client.ApiKeys.EnableAsync(id);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        // 7. POST /api/api-keys/{id}/rotate - Rotate Key Secret
        [HttpPost("{id}/rotate")]
        public async Task<IActionResult> Rotate(string id)
        {
            try
            {
                var result = await _client.ApiKeys.RotateAsync(id);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        // 8. DELETE /api/api-keys/{id} - Delete Key
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var result = await _client.ApiKeys.DeleteAsync(id);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }
    }
}

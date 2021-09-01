using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MyAPI.Data;
using MyAPI.DTOs;
using MyAPI.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;


namespace MyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class reviewController : ControllerBase


    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<reviewController> _logger;
        public reviewController(IUnitOfWork unitOfWork, IMapper mapper, ILogger<reviewController> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }


        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDTO unitDTO)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogError($"Invalid POST attempt in {nameof(CreateReview)}");
                return BadRequest(ModelState);
            }
            var existingReview = await _unitOfWork.Reviews.Get(q => q.UserID == unitDTO.UserID && q.ProductId == unitDTO.ProductId);
            if (existingReview != null)
            {
                existingReview.Star = unitDTO.Star;
                existingReview.Content = unitDTO.Content;
                existingReview.Date = unitDTO.Date;
                _unitOfWork.Reviews.Update(existingReview);
                await _unitOfWork.Save();
                return Accepted(new { review = existingReview,update=true});
            }


            try
            {
                var query = _mapper.Map<Review>(unitDTO);
                await _unitOfWork.Reviews.Insert(query);
                await _unitOfWork.Save();

                return Accepted(new { review = query, update=false});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something Went Wrong in the {nameof(CreateReview)}");
                return StatusCode(500, "Internal Server Error. Please Try Again Later." + ex.ToString());
            }
        }

    }
}

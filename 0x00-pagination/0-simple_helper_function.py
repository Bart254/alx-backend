#!/usr/bin/env python3
""" Pagination"""
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """ Returns the index range of a page based on page_size

    Args:
        page(int): page whose index is to be returned
        page_size(int): size of one page

    Returns:
        List[int, int]: list of start and end index of page
    """
    start: int = (page - 1) * page_size
    end: int = page * page_size
    return (start, end)
